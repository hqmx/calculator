# HQMX Calculator

This project contains the frontend code for the HQMX Calculator service.

## 🚀 Deployment

This project is deployed to a unified EC2 instance. To deploy, run the main deployment script from the project root:

```bash
./deploy_all_to_ec2.sh
```

This will sync the `frontend` directory to `/var/www/hqmx/calculator/` on the server.
