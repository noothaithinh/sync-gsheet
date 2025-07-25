# GitHub Variables Setup Guide

This guide explains how to configure GitHub environment variables for resource allocation in your Cloud Run deployments.

## Overview

The deployment workflow now uses GitHub variables to configure Cloud Run resources dynamically. This allows you to easily adjust memory, CPU, and scaling settings without modifying the workflow file.

## GitHub Variables vs Secrets

- **Variables** (`vars`): Non-sensitive configuration values that can be seen in logs
- **Secrets** (`secrets`): Sensitive data like API keys that are encrypted and masked in logs

For resource configurations, we use **variables** since they're not sensitive information.

## Required GitHub Variables

### Repository-Level Variables

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab

#### Global Variables
| Variable Name | Description | Default Value | Example |
|---------------|-------------|---------------|---------|
| `REGION` | Google Cloud region | `asia-southeast1` | `asia-southeast1` |
| `PORT` | Application port | `3000` | `3000` |

#### Production Environment Variables
| Variable Name | Description | Default Value | Example |
|---------------|-------------|---------------|---------|
| `PROD_MEMORY` | Production memory allocation | `2Gi` | `2Gi`, `4Gi` |
| `PROD_CPU` | Production CPU allocation | `2` | `1`, `2`, `4` |
| `PROD_MAX_INSTANCES` | Production max instances | `20` | `10`, `20`, `50` |

#### Nightly Environment Variables
| Variable Name | Description | Default Value | Example |
|---------------|-------------|---------------|---------|
| `NIGHTLY_MEMORY` | Nightly memory allocation | `1Gi` | `512Mi`, `1Gi`, `2Gi` |
| `NIGHTLY_CPU` | Nightly CPU allocation | `1` | `0.5`, `1`, `2` |
| `NIGHTLY_MAX_INSTANCES` | Nightly max instances | `5` | `1`, `5`, `10` |

## How to Add Variables

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click the **Variables** tab
4. Click **New repository variable**
5. Enter the variable name and value
6. Click **Add variable**

### Method 2: GitHub CLI

```bash
# Set global variables
gh variable set REGION --body "asia-southeast1"
gh variable set PORT --body "3000"

# Set production variables
gh variable set PROD_MEMORY --body "2Gi"
gh variable set PROD_CPU --body "2"
gh variable set PROD_MAX_INSTANCES --body "20"

# Set nightly variables
gh variable set NIGHTLY_MEMORY --body "1Gi"
gh variable set NIGHTLY_CPU --body "1"
gh variable set NIGHTLY_MAX_INSTANCES --body "5"
```

## Example Configurations

### Cost-Optimized Setup
```bash
# Minimal resources for development
gh variable set NIGHTLY_MEMORY --body "512Mi"
gh variable set NIGHTLY_CPU --body "0.5"
gh variable set NIGHTLY_MAX_INSTANCES --body "3"

# Moderate resources for production
gh variable set PROD_MEMORY --body "1Gi"
gh variable set PROD_CPU --body "1"
gh variable set PROD_MAX_INSTANCES --body "10"
```

### High-Performance Setup
```bash
# Standard resources for development
gh variable set NIGHTLY_MEMORY --body "1Gi"
gh variable set NIGHTLY_CPU --body "1"
gh variable set NIGHTLY_MAX_INSTANCES --body "5"

# High resources for production
gh variable set PROD_MEMORY --body "4Gi"
gh variable set PROD_CPU --body "4"
gh variable set PROD_MAX_INSTANCES --body "50"
```

## Resource Guidelines

### Memory Allocation
- **512Mi**: Basic apps, low traffic
- **1Gi**: Standard web applications
- **2Gi**: Medium traffic applications
- **4Gi+**: High traffic or memory-intensive apps

### CPU Allocation
- **0.5**: Minimal processing needs
- **1**: Standard web applications
- **2**: Medium processing requirements
- **4+**: CPU-intensive applications

### Max Instances
- **1-5**: Development/testing environments
- **10-20**: Production applications with moderate traffic
- **50+**: High-traffic production applications

## Default Values

If you don't set these variables, the workflow will use these defaults:

| Environment | Memory | CPU | Max Instances | Region | Port |
|-------------|---------|-----|---------------|--------|------|
| **Nightly** | 1Gi | 1 | 5 | asia-southeast1 | 3000 |
| **Production** | 2Gi | 2 | 20 | asia-southeast1 | 3000 |

## Troubleshooting

### Variable Not Found
If you see an error about a variable not being found:
1. Check the variable name spelling
2. Ensure the variable is set at the repository level
3. Variables are case-sensitive

### Resource Allocation Errors
If Cloud Run deployment fails due to resource allocation:
1. Check Google Cloud quotas
2. Verify the region supports the requested resources
3. Ensure CPU and memory combinations are valid

## Benefits of Using Variables

✅ **Flexibility**: Change resources without modifying workflow files  
✅ **Environment-Specific**: Different configurations per environment  
✅ **Team Collaboration**: Team members can adjust settings via UI  
✅ **Auditability**: Changes to variables are logged  
✅ **Rollback**: Easy to revert configuration changes  

## Next Steps

1. Set up the variables using one of the methods above
2. Test deployments to both nightly and production environments
3. Monitor resource usage and adjust as needed
4. Consider setting up environment-specific variables for more granular control
