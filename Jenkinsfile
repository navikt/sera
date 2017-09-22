node {
    def mvnHome, mvn, nodeHome, npm, node // tools
    def committer, committerEmail, changelog, releaseVersion // metadata
    def application = "sera"
    def dockerDir = "./docker"
    def distDir = "${dockerDir}/dist"


    try {
        stage("checkout") {
            git url: "ssh://git@stash.devillo.no:7999/aura/${application}.git"
            sh "hostname"
        }

        stage("initialize") {
            mvnHome = tool "maven-3.3.9"
            mvn = "${mvnHome}/bin/mvn"
            changelog = sh(script: 'git log `git describe --tags --abbrev=0`..HEAD --oneline', returnStdout: true)
            releaseVersion = sh(script: 'npm version major | cut -d"v" -f2', returnStdout: true).trim()

            // aborts pipeline if releaseVersion already is released
            sh "if [ \$(curl -s -o /dev/null -I -w \"%{http_code}\" http://maven.adeo.no/m2internal/no/nav/aura/${application}/${application}/${releaseVersion}) != 404 ]; then echo \"this version is somehow already released, manually update to a unreleased SNAPSHOT version\"; exit 1; fi"
            committer = sh(script: 'git log -1 --pretty=format:"%ae (%an)"', returnStdout: true).trim()
            committerEmail = sh(script: 'git log -1 --pretty=format:"%ae"', returnStdout: true).trim()
        }

        stage("create version") {
            sh "${mvn} versions:set -f app-config/pom.xml -DgenerateBackupPoms=false -B -DnewVersion=${releaseVersion}"
            sh "git commit -am \"set version to ${releaseVersion} (from Jenkins pipeline)\""
            sh "git push origin master"
            sh "git tag -a ${application}-${releaseVersion} -m ${application}-${releaseVersion}"
            sh "git push --tags"
        }

        stage("build frontend bundle") {
            withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {

                // installing modules and building front-end bundle
                sh "npm install && npm run build || exit 1"
                // copying files to docker image
                sh "mkdir -p ${distDir}"
                sh "cp -r production_server.js app.js package.json dist api app-config ${distDir}"
                // workaround for local variables being required production environment
                sh "echo {} > ${distDir}/localvars.json"
                // getting modules for production
                sh "cd ${distDir} && npm install --production || exit 1"
                sh "cp Dockerfile ${dockerDir}"
            }
        }

        stage("run frontend unit tests") {
            sh "npm run unittest || exit 1"
        }

        stage("build and publish docker image") {
            def imageName = "docker.adeo.no:5000/${application}:${releaseVersion}"
            sh "sudo docker build -t ${imageName} ./docker"
            sh "sudo docker push ${imageName}"
        }

        stage("publish app-config artifact") {
            sh "${mvn} clean deploy -f app-config/pom.xml -DskipTests -B -e"
        }

//        stage("jilease") {
//            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jiraServiceUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
//                sh "/usr/bin/jilease -jiraUrl http://jira.adeo.no -project AURA -application ${application} -version $releaseVersion -username $env.USERNAME -password $env.PASSWORD"
//            }
//        }

        stage("deploy to cd-u1") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh "${mvn} aura:deploy -Dapps=${application}:${releaseVersion} -Denv=cd-u1 -Dusername=${env.USERNAME} -Dpassword=${env.PASSWORD} -Dorg.slf4j.simpleLogger.log.no.nav=debug -B -Ddebug=true -e"
            }
        }

        stage("integration tests") {
            sh "npm run integrationtest"
        }

        stage("deploy to production") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh "${mvn} aura:deploy -Dapps=${application}:${releaseVersion} -Denv=p -Dusername=${env.USERNAME} -Dpassword=${env.PASSWORD} -Dorg.slf4j.simpleLogger.log.no.nav=debug -B -Ddebug=true -e"
            }
        }

        stage("selftest") {
            sh "chmod +x selftest.sh && ./selftest.sh"
        }

        if (currentBuild.result == null) {
            currentBuild.result = "SUCCESS"
        }
    } catch (err) {
        if (currentBuild.result == null) {
            currentBuild.result = "FAILURE"
        }
        throw err
    } finally {
        step([$class       : 'InfluxDbPublisher',
              customData   : null,
              customDataMap: null,
              customPrefix : 'aura_pipeline',
              target       : 'influxDB'])
    }

//        GString message = "${application}:${releaseVersion} now in production. See jenkins for more info ${env.BUILD_URL}\nLast commit ${changelog}"
//        mail body: message, from: "jenkins@aura.adeo.no", subject: "SUCCESSFULLY completed ${env.JOB_NAME}!", to: committerEmail
//        def successmessage = "Successfully deployed fasit-frontend:${releaseVersion} to prod\nhttps://fasit-frontend.adeo.no"
//        hipchatSend color: 'GREEN', message: successmessage, textFormat: true, room: 'AuraInternal', v2enabled: true

//        GString message = "AIAIAI! Your last commit on ${application} didn't go through. See log for more info ${env.BUILD_URL}\nLast commit ${changelog}"
//        mail body: message, from: "jenkins@aura.adeo.no", subject: "FAILED to complete ${env.JOB_NAME}", to: committerEmail
//
//        def errormessage = "see jenkins for more info ${env.BUILD_URL}\nLast commit ${changelog}"
//        hipchatSend color: 'RED', message: "@all ${env.JOB_NAME} failed\n${errormessage}", textFormat: true, notify: true, room: 'AuraInternal', v2enabled: true


}
