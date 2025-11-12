pipeline {
    agent any

    environment {
        DOCKER_HOST = 'tcp://docker:2376'
        DOCKER_CERT_PATH = '/certs/client'
        DOCKER_TLS_VERIFY = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/ordering-ms.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/ms-management') {
                    sh 'docker build -t ms-management:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend/ocpp-csms-angular') {
                    sh 'docker build -t ocpp-frontend:latest .'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Add backend/frontend tests here if any"
            }
        }

        stage('Deploy Services') {
            steps {
                sh '''
                docker rm -f ms-management || true
                docker rm -f ocpp-frontend || true
                docker run -d --name ms-management ms-management:latest
                docker run -d --name ocpp-frontend -p 4000:4000 ocpp-frontend:latest
                '''
            }
        }
    }

    post {
        always {
            echo "CI/CD Pipeline for ordering-ms completed!"
        }
    }
}
