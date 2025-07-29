pipeline {
    agent any

    stages {
        stage('Test pipeline') {
            steps {
                echo "🚀 Jenkins fonctionne sur la branche ${env.BRANCH_NAME} !"
                sh 'echo Hello from Jenkins'
            }
        }
    }
}
