# AWS Deployment

### MORE INFO ABOUT DEPLOY: https://foxhunt-simulator.atlassian.net/jira/software/c/projects/FOX/pages

### Building an image

You can build your images locally with `docker build` and push them straight to ECR (Elastic Container Registry) with `docker push`. Just make sure, that you have installed your **AWS CLI** and authorized before pushing an image.
The appropriate ECR repository must be already created, too. There are already created repositories for **admin-portal**, **admin-portal-front**, **organization-portal** and **organization-portal-front** apps. **Note:** If you're unfamiliar with docker cli, ECR shows all the needed commands in "View push commands" button.

## Create new service

1. Create new EC2 instance
   **Important** Amazon forces us to use 30 GB storage for each EC2 instance, connected with ECS. This cost 3$/month. The easiest way to launch more 8 GB instances is using "launch more like this", but it leads to auto attaching 22GB storage to the instance. To avoid this, in 'launch more like this' page choose Browse more AMIs => choose ami-004ec328427f27f98 Community AMI => remove 22GB storage in Configure storage menu, Choose new name, Fox-hunt-key-pair, enable auto-assign public IP => launch
2. Create Task Definition
   Login to AWS console and navigate to ECS (Elastic Container Service).
   Navigate to Task Definitions section.
   Create new Task Definition: - Choose EC2 launch type. - In "Add container" section specify a container with the image you have just pushed and map working port. In the same section you can define environment variables for the container to start it with(e.g. db credentials). - If you assign task on specific instance: task definition -> add constraint -> memberOf -> instance:ec2InstanceId == $instance id - **Note**: Remember to switch on automatic CloudWatch logs configuration and create log group for it if you want to track your app logs. - **Note**: If you need to update agent on optimized ec2, you should connect to the instance via ssh and execute $sudo yum update -y ecs-init

Note: fox-hunt-organization-front\nginx\nginx-entrypoint.sh and fox-hunt-front\nginx\nginx-entrypoint.sh files must have LF end of lines (can be added with notebook)

## Connect EC2 with SSH

If you need to connect an instance with SSH ask PM for a pem key or putty key file.
Some instances have my-key-pair key, this key was lost. New instance must be launched from old with Fox-hunt-key-pair key (create new service paragraph).

### Instantiate your app in cluster

1. Make sure, that there are enough resources of existing EC2 instances for your app to run and launch some more if you need. For now, we use free tier of AWS, so remember to choose t2.micro ecs-optimized AMIs or just click "Launch more like this" on existing instance.
2. Create ECS service:
   - Navigate to "default" cluster and click "Create" on Services tab
   - Specify EC2 launch type, choose created task definition, input service name and number of tasks(e.g. 1). Specify task placement template(e.g. One Task Per Host)
   - In the next step of configuring network choose appropriate ALB(Application Load Balancer) (if you want to communicate to your app directly through it; should be chosen for frontend apps). Click "Add to load balancer" and specify production listener port and target group.
   - Go through the next steps and finally create service.
3. Navigate to default cluster and verify status of new task is PENDING or already RUNNING. When it is RUNNING, you can view logs of the app, if configured it in Task Definition.
4. App should be accessible via public IP or DNS of the EC2 instance it is running on or via configured ALB if security groups allow you to connect.

### Update image only procedure

You can omit "Create Task Definition" and "Instantiate your app in cluster" parts if you just want to update an image of running microservice. In this case, you should only push image to the repository and start a new task of service.
It can be done via manual stopping the task, ECS will automatically start a new one, if desired task number is bigger than actual task number. Also, **remove unused images** from ECR to save AWS space because it costs money.

## Using Jenkins for CI/CD

1. Navigate to AWS and log-in.
2. Go to EC2 service.
3. Choose the instance with a name 'CI/CD Host'. If instance is stopped, click `Actions`->`Instance State`->`Start` and wait till the instance is in running state.
4. Connect to instance and execute:
   $sudo service docker start
	$sudo service jenkins start
5. Find public DNS or ip address of the instance and open it via browser on port 8080.
6. Log into Jenkins with username: admin and Capital1067!.
7. Click on the job of the app you want to build and navigate to 'Build with parameters'. Specify the wanted branch and click build.
8. If build is successful, you will see a new image pushed to ECR and new deployment in ECS. Otherwise, you can inspect build logs to troubleshoot the reason of failure.

## Setup new CI/CD instance

1.  Launch new EC2 instance
2.  Connect to the instance (for example AWS 'connect' if supported, or Putty)
3.  Update instance: $sudo yum update
4.  Install JDK: $sudo amazon-linux-extras install java-openjdk11
5.  Install Node JS:
    $curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
	$. ~/.nvm/nvm.sh
    $nvm install node
6.  Check that Node Js is installed: $node -e "console.log('Running Node.js ' + process.version)"
7.  Install Jenkins:
    $sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
	$sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
    $sudo yum install jenkins -y
8.  Start Jenkins
    $sudo service jenkins start

9.  Get initial secret for Jenkins:
    $sudo cat /var/lib/jenkins/secrets/initialAdminPassword
10. Connect to Jenkins with instance public dns + 8080 port
11. Sign in with secret and create user
12. Install additional plugins for Jenkins:
    Docker
    Docker API
    docker-build-step
    Amazon ECR
    Maven Integration
13. Install git: $sudo yum install git
14. Install MAVEN (be aware that it can downgrade your jdk, use 'sudo /usr/sbin/alternatives --config java'
    and 'sudo /usr/sbin/alternatives --config javac' to switch between runtime and compile java versions):
    $cd /usr/local/lib/
    $sudo wget http://ftp.meisei-u.ac.jp/mirror/apache/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
    $sudo tar -xzvf apache-maven-3.6.3-bin.tar.gz
    $sudo mv apache-maven-3.6.3 /opt/
    $cd /opt/
    $sudo ln -s /opt/apache-maven-3.6.3 apache-maven
    $cd
    $vi .bash_profile

        Add:
        MVN_HOME=/opt/apache-maven
        PATH=$MVN_HOME/bin:$PATH:$HOME/.local/bin:$HOME/bin

        Then:
        $source .bash_profile

        Check mvn version:
        $mvn --version

15. Install Docker:
    $sudo amazon-linux-extras install docker

    Add default user to Docker groups:
    $sudo usermod -a -G docker ec2-user

    Start Docekr:
    $sudo service docker start

    Modify execstart:
    $sudo vi /lib/systemd/system/docker.service

    Repalce ExecStart with:
    ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:4243 -H unix:///var/run/docker.sock

    shift+z to save file

    Restart docker:
    $sudo systemctl daemon-reload
	$sudo systemctl restart docker

    Check docker url:
    $curl http://localhost:4243/version

16. Setup Jenkins Configure Clouds (Настроить Jenkis -> Конфигурация системы -> Cloud)
    Set Docker Host URI (tcp://127.0.0.1:4243) and test connection (dont use public dns or IP as they are change each time server is restarted)

    You can create a 'New Personal Access Token' in GitLab, to connect to the GitLab during running the job. The value of the token will be a password of the new credentials of Jenkins.
    You can use your IAM user secret and the key to create AWS creds for Jenkins to use for pushing the image to ECR

    Add maven in Jenkins global tool configuration (3.6.3)
    Add docker in Jenkins global tool configuration

17. Starting Jenkins and Docker:
    $sudo service docker start
	$sudo service jenkins start

## Setup new Node JS service

1. nest new|n [options] [name] in the root folder
2. Copy eslint and prettier configuration from other nest service
3. husky configuration:
   npm i -D husky
   add src folder in .husky/pre-commit
   add script to package.json:
   "prepare": "cd .. && husky install .husky"
4. Dockerfile is the same as for other nest services
5. Docker-compose
   Use port, that is not used by other services or booked by operational system
6. AWS
   Check Create new service paragraph

## Start existing microservices in AWS

1. Open Amazon ECS page.
2. From the left panel, go to Task Definitions.
3. Click the checkbox next to the service that you want to launch, then Actions => Run Task.
4. Click Launch type - EC2.
   4.1. Scroll down, click Advanced Options, find Environment variable overrides - check which services are needed to be running for running the task. Then you need to start EC2 instances of these services.
   4.2. In another browser tab open Amazon EC2 page.
   4.3. Start instances of services that are needed to be running in order to run a task.
5. Again in ECS tab scroll down, click Advanced Options, find Environment variable overrides - complete values for the listed keys. For that, find private IP addresses in EC2 running instances.
6. Also check if the POSTGRES_HOST is correct by comparing the displayed address with running DB instance address. If not, update the DB address.
7. Click Run Task.
8. From the left panel, go to Clusters (while still being in Amazon ECS page)
9. Click Tasks tab and verify if the task is running.
10. Go to AWS CloudWatch.
11. From the left panel, Logs -> Log groups
12. Find the service that you launched.
13. Open the latest log stream and verify if there are no errors and the service is running.

### AWS RDS

In the cloud we use different credentials to database than locally. If needed, here are the steps to get these credentials:

1. Log into AWS Platform.
2. Open ECS service.
3. In the left menu bar choose "Task definitions" and then "admin-portal-backend".
4. Choose the latest task definition.
5. Scroll down to “Container Definition” section and unwrap hidden table by clicking on “arrow” icon.

### AWS Lambda

There are two frameworks that allow to conveniently deploy a lambda function to AWS - Serverless (https://www.serverless.com/) and AWS SAM (https://aws.amazon.com/serverless/sam/). Here we are using the Serverless framework but feel free to consider using AWS SAM in the future.

The steps presented below were tested on the fox-hunt-api-gateway service. Keep in mind that the steps might be different when creating lambda functions from different services especially if they use technology different than Nest.js

Prerequisites:

- Nest CLI installed - npm install -g @nestjs/cli

1. Create and configure the serverless.yml file. Save it in the root folder of the service.
2. Create a bundle of the project using Webpack.
   2.1. Create and configure the webpack.config.js file. Save it in the root folder of the service. The exemplary configuration can be found here: https://docs.nestjs.com/faq/serverless.
   2.2. Run 'nest build --webpack' command. If configured properly, the .js file should be created in the path speciied in the webpack.config.js file.
3. Run the lambda function locally using the command 'npx serverless offline' and test if it's working properly.
4. Modify the .env file so that the addresses of services and credentials of database matches the AWS infrastructure configuration. Uncomment the NODE_ENV value.
5. Deploy the lambda function to AWS by running the 'npx serverless deploy --stage prod' command.
6. Go to AWS Lambda and find the deployed lambda function.
7. Configuration -> Permissions -> Click the role in the Execution Role section.
8. In the Permission policies Add permissions -> Attach policies.
9. Find the AWSLambdaVPCAccessExecutionRole, click the checkbox and Attach policies button. This might take a few minutes to be completed.
10. Back in AWS Lambda configuration go to VPC tab, click Edit, choose the VPC, add every subnet and the default security group. Click save.
11. Test the deployed lambda function.

Why do we need the NODE_ENV=lambda when running AWS Lambda function?

When running the app in the standard way, the entire project gets transpiled from TypeScript to JavaScript and put into the /dist folder. When making a bundle with webpack the project is also transpiled into JS, but the code is packed into a single file. Now lets look at how the entities are loaded into TypeORM configuration:

- entities: ['dist/**/*.entity.js'] (from config.service.js file in fox-hunt-api-gateway)

So the entities are loaded directly from the _.entity.js files from dist folder. But when making a webpack bundle there are no _.entity.js files. So in this case we need to load the entities differently. Basically, we need two different ways of loading the entities to database connection, one for regular app launch and one for AWS Lambda launch. That's why we need some environmental variable - to determine how we want to load the entities. You can see two diffenent ways of loading the entities in config.service.ts file in fox-hunt-api-gateway app.

Contact @Uladzislau.Leusha for any related questions.
