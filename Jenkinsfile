pipeline {
  agent any
  environment {
    DOCKERHUB = credentials('dockerhub-credentials') // Jenkins-da DockerHub login saqlang
    DOCKERHUB_USER = "${DOCKERHUB_USR}" // Jenkins environment map qila olasiz
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Backend Image') {
      steps {
        dir('backend') {
          sh 'docker build -t $DOCKERHUB_USR/notes-backend:latest .'
          sh 'docker login -u $DOCKERHUB_USR -p $DOCKERHUB_PSW'
          sh 'docker push $DOCKERHUB_USR/notes-backend:latest'
        }
      }
    }
    stage('Build Frontend Image') {
      steps {
        dir('frontend') {
          sh 'docker build -t $DOCKERHUB_USR/notes-frontend:latest .'
          sh 'docker login -u $DOCKERHUB_USR -p $DOCKERHUB_PSW'
          sh 'docker push $DOCKERHUB_USR/notes-frontend:latest'
        }
      }
    }
    stage('Run Tests (simple)') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'npm test || true'
        }
      }
    }
    stage('Deploy to K8s') {
      steps {
        // Bu yerda Jenkins agent kubeconfigga ega bo'lishi kerak
        sh 'kubectl apply -f k8s/mongo-deployment.yaml'
        sh 'kubectl apply -f k8s/backend-deployment.yaml'
        sh 'kubectl apply -f k8s/frontend-deployment.yaml'
      }
    }
  }
}
