# test-public-repo - Helm Charts

This repo contains Helm charts managed via GitHub Actions.

## Available Charts

- nginx-multiple - To deploy the same deployment n number of times based on the values

## Usage

Add repo:

```bash
helm repo add portainer-charts https://portainer.github.io/test-public-repo/
helm repo update
```

Install chart:

```bash
helm install my-nginx portainer-charts/nginx-multiple
```
