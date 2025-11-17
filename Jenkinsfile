pipeline {
    agent any

    environment {
        // Docker Hub credentials (optional)
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds'
        DOCKER_REGISTRY = 'rami223'
        STACK_NAME = 'ordering'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Rami221/ordering-ms.git', branch: 'main'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -t rami223/auth-service:latest ./auth-service'
                    sh 'docker build -t rami223/order-service:latest ./order-service'
                }
            }
        }

        stage('Push to Docker Hub (Optional)') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push rami223/auth-service:latest'
                    sh 'docker push rami223/order-service:latest'
                }
            }
        }

        stage('Deploy Docker Stack') {
            steps {
                script {
                    // Remove existing stack if any
                    sh "docker stack rm ${STACK_NAME} || true"
                    sleep 5
                    // Deploy new stack
                    sh "docker stack deploy -c ${COMPOSE_FILE} ${STACK_NAME}"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
