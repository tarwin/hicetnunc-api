# Just to show how we could use IAM policy

## Setup

- Create Lambda (ie "HenDevApi")

- Create a Polucy group (ie "HenDev")
- Add the policy in `_iam_policy.json`. Note this allows specific access to "HenDev*", any Lambda starting with "HenDev". Can deploy new versions, and also look at CloudWatch logs.

- Create an IAM user
- Attach this policy
- Save the `access key` and `secret`
- Add access key and secret to your `~/.aws/credentials` file with profile named 'hendev' 
- Share this access key / secret with other devs

## Usage

- Added scripts to package.json
- `npm run deploy:dev` deploys a ZIP file named 'lambda.zip' to Lambda. Need a way to package / create ZIP. Also need to change to correct region.
- `npm run logs` shows logs for this Lambda. Uses `aws-logs-tail-group.sh`. Need to add some settings in this file to do with the specific group names etc.