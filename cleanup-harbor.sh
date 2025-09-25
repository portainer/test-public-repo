#!/bin/bash
set -euo pipefail

# Harbor cleanup script - delete all Apache charts from Harbor registry
HARBOR_REPO="harbor.portainercloud.io/helm/apache"

echo "🧹 Cleaning up all Apache charts from Harbor..."

# Check if HARBOR_ROBOT_USER and HARBOR_ROBOT_TOKEN are set
if [[ -z "${HARBOR_ROBOT_USER:-}" ]] || [[ -z "${HARBOR_ROBOT_TOKEN:-}" ]]; then
    echo "❌ Error: Please set HARBOR_ROBOT_USER and HARBOR_ROBOT_TOKEN environment variables"
    echo "Example:"
    echo "export HARBOR_ROBOT_USER='robot\$your-robot-user'"
    echo "export HARBOR_ROBOT_TOKEN='your-robot-token'"
    exit 1
fi

# Login to Harbor
echo "🔐 Logging into Harbor..."
echo "$HARBOR_ROBOT_TOKEN" | oras login harbor.portainercloud.io \
    -u "$HARBOR_ROBOT_USER" --password-stdin

# Get all Apache chart versions
echo "📋 Getting list of all Apache chart versions..."
all_versions=$(oras repo tags "${HARBOR_REPO}/apache" 2>/dev/null || true)

if [[ -z "$all_versions" ]]; then
    echo "✅ No Apache charts found in Harbor - already clean!"
    exit 0
fi

echo "Found versions:"
echo "$all_versions"

# Delete all versions
echo "🗑️ Deleting all Apache chart versions..."
while IFS= read -r version; do
    [[ -z "$version" ]] && continue
    echo "  • Deleting ${HARBOR_REPO}/apache:$version"
    oras manifest delete "${HARBOR_REPO}/apache:$version" --force || true
done <<< "$all_versions"

# Also clean up common chart if it exists
echo "🧹 Cleaning up common charts from Harbor..."
common_versions=$(oras repo tags "harbor.portainercloud.io/helm/common" 2>/dev/null || true)
if [[ -n "$common_versions" ]]; then
    while IFS= read -r version; do
        [[ -z "$version" ]] && continue
        echo "  • Deleting harbor.portainercloud.io/helm/common:$version"
        oras manifest delete "harbor.portainercloud.io/helm/common:$version" --force || true
    done <<< "$common_versions"
fi

echo "✅ Harbor cleanup complete!"