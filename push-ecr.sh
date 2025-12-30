#!/usr/bin/env bash
#
# Usage:
#   ./push-ecr.sh --profile <AWS_PROFILE> [--region <AWS_REGION>] [--platform <DOCKER_PLATFORM>] [--tag <IMAGE_TAG>]
#
# Example:
#   ./push-ecr.sh --profile todo-app-develop-admin
#   ./push-ecr.sh --profile todo-app-develop-admin --region ap-northeast-1 --platform linux/amd64 --tag latest
#
set -euo pipefail

# ----------------------------
# Argument parsing
# ----------------------------
AWS_PROFILE=""
AWS_REGION="ap-northeast-1"
DOCKER_PLATFORM="linux/amd64"
IMAGE_TAG="latest"

usage() {
  cat <<'EOF'
Usage:
  ./push-ecr.sh --profile <AWS_PROFILE> [--region <AWS_REGION>] [--platform <DOCKER_PLATFORM>] [--tag <IMAGE_TAG>]

Options:
  --profile   AWS CLI profile name (required)
  --region    AWS region (default: ap-northeast-1)
  --platform  Docker build platform (default: linux/amd64)
  --tag       Docker image tag (default: latest)

Example:
  ./push-push-ecr.sh --profile todo-app-develop-admin
  ./push-push-ecr.sh --profile todo-app-develop-admin --region ap-northeast-1 --platform linux/amd64 --tag latest
EOF
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      AWS_PROFILE="${2:-}"
      shift 2
      ;;
    --region)
      AWS_REGION="${2:-}"
      shift 2
      ;;
    --platform)
      DOCKER_PLATFORM="${2:-}"
      shift 2
      ;;
    --tag)
      IMAGE_TAG="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "Unknown argument: $1 (use --help)"
      ;;
  esac
done

[[ -n "${AWS_PROFILE}" ]] || { usage; die "--profile is required."; }

# ----------------------------
# Preconditions
# ----------------------------
command -v aws >/dev/null 2>&1 || die "aws CLI is not installed."
command -v docker >/dev/null 2>&1 || die "docker is not installed."

echo "Validating AWS credentials..."
aws sts get-caller-identity --profile "${AWS_PROFILE}" >/dev/null 2>&1 \
  || die "Failed to validate AWS credentials for profile: ${AWS_PROFILE}"

# ----------------------------
# Discover AWS Account ID (from --profile)
# ----------------------------
echo "Resolving AWS Account ID from the specified profile..."
AWS_ACCOUNT_ID="$(
  aws sts get-caller-identity \
    --profile "${AWS_PROFILE}" \
    --query 'Account' \
    --output text
)"
[[ -n "${AWS_ACCOUNT_ID}" && "${AWS_ACCOUNT_ID}" != "None" ]] || die "Failed to resolve AWS Account ID."

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ----------------------------
# Resolve ECR repository name by searching repositories with key "backend"
# - Idempotent: does not create/modify state; only reads and selects.
# - Selection rule:
#   1) Exact match: "backend"
#   2) Otherwise, repositories whose name contains "backend"
#   3) If multiple remain, fail to avoid pushing to a wrong repo.
# ----------------------------
echo "Searching ECR repositories for key: backend ..."
mapfile -t CANDIDATES < <(
  aws ecr describe-repositories \
    --region "${AWS_REGION}" \
    --profile "${AWS_PROFILE}" \
    --query 'repositories[].repositoryName' \
    --output text \
  | tr '\t' '\n' \
  | grep -F "backend" || true
)

if [[ ${#CANDIDATES[@]} -eq 0 ]]; then
  die "No ECR repository found containing: backend"
fi

REPO=""
for r in "${CANDIDATES[@]}"; do
  if [[ "${r}" == "backend" ]]; then
    REPO="backend"
    break
  fi
done

if [[ -z "${REPO}" ]]; then
  if [[ ${#CANDIDATES[@]} -eq 1 ]]; then
    REPO="${CANDIDATES[0]}"
  else
    echo "Multiple repositories matched 'backend'. Refusing to choose automatically:" >&2
    printf ' - %s\n' "${CANDIDATES[@]}" >&2
    die "Please rename repositories to make the match unique (or adjust the script selection rule)."
  fi
fi

IMAGE_URI="${ECR_REGISTRY}/${REPO}:${IMAGE_TAG}"

echo "Resolved settings:"
echo "  Profile:  ${AWS_PROFILE}"
echo "  Region:   ${AWS_REGION}"
echo "  Account:  ${AWS_ACCOUNT_ID}"
echo "  Repo:     ${REPO}"
echo "  Image:    ${IMAGE_URI}"
echo "  Platform: ${DOCKER_PLATFORM}"

# ----------------------------
# ECR login (idempotent)
# ----------------------------
echo "Logging in to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" --profile "${AWS_PROFILE}" \
  | docker login --username AWS --password-stdin "${ECR_REGISTRY}" >/dev/null
echo "ECR login succeeded."

# ----------------------------
# Build image (idempotent w.r.t. tag; always rebuild unless you remove --no-cache)
# Note: keeping --no-cache mirrors the original behavior.
# ----------------------------
echo "Building Docker image..."
docker build --no-cache --platform "${DOCKER_PLATFORM}" -t "${IMAGE_URI}" .
echo "Docker build succeeded."

# ----------------------------
# Push image (idempotent in practice: pushing same digest is safe)
# ----------------------------
echo "Pushing Docker image to ECR..."
docker push "${IMAGE_URI}"
echo "Docker push succeeded."

echo "All done!"
