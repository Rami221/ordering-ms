pipeline {
    agent any

    environment {
        // Load Docker Hub credentials stored in Jenkins
        DOCKER_CRED = credentials('docker-hub-credentials')

        IMAGE_AUTH = "rami223/auth-service:latest"
        IMAGE_ORDER = "rami223/order-service:latest"
        SWARM_MANAGER = "192.168.100.54" // IP of your Docker Swarm manager node
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📦 Checking out code from GitHub..."
                git branch: 'main', url: 'https://github.com/Rami221/ordering-ms.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images..."
                sh "docker build -t ${IMAGE_AUTH} ./auth-service"
                sh "docker build -t ${IMAGE_ORDER} ./order-service"
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo "🚀 Pushing Docker images to Docker Hub..."
                sh "echo ${DOCKER_CRED_PSW} | docker login -u ${DOCKER_CRED_USR} --password-stdin"
                sh "docker push ${IMAGE_AUTH}"
                sh "docker push ${IMAGE_ORDER}"
            }
        }

        stage('Deploy to Docker Swarm') {
            steps {
                echo "🌀 Updating services on Docker Swarm..."
                sh """
                    ssh -o StrictHostKeyChecking=no kali@${SWARM_MANAGER} '
                        docker service update --image ${IMAGE_AUTH} ordering_auth-service || docker service create --name ordering_auth-service ${IMAGE_AUTH};
                        docker service update --image ${IMAGE_ORDER} ordering_order-service || docker service create --name ordering_order-service ${IMAGE_ORDER};
                    '
                """
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully. Swarm services updated."
        }
        failure {
            echo "❌ Pipeline failed. Please check Jenkins logs for more details."
        }
    }
}
