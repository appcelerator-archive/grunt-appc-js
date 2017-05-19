library 'pipeline-library'

timestamps {
	node('(osx || linux) && git && npm-publish') {
		def packageVersion = ''
		def isPR = false
		def tagGit = true
		def publish = true

		stage('Checkout') {
			checkout scm

			isPR = env.BRANCH_NAME.startsWith('PR-')
			tagGit = !isPR
			publish = !isPR

			def packageJSON = jsonParse(readFile('package.json'))
			packageVersion = packageJSON['version']
			currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
		}

		nodejs(nodeJSInstallationName: 'node 6.9.5') {
			ansiColor('xterm') {

				stage('Dependencies') {
					sh 'npm install --production'
				} // stage

				stage('Security') {
					// Scan for NSP and RetireJS warnings
					sh 'npm install nsp'
					sh 'node_modules/nsp/bin/nsp check --output summary --warn-only'
					sh 'npm uninstall nsp'
					sh 'npm prune'

					sh 'npm install retire'
					sh 'node_modules/retire/bin/retire --exitwith 0'
					sh 'npm uninstall retire'
					sh 'npm prune'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				}

				stage('Build') {
					sh 'npm install'
					sh 'npm test'
				} // stage

				stage('Publish') {
					if (tagGit) {
						// FIXME Include changes in the tag message?
						pushGitTag(force: true, name: packageVersion, message: "See ${env.BUILD_URL} for more information.")
					} // tagGit
					if (publish) {
						sh 'npm publish'
					}
				} // stage
			} // ansiColor
		} // nodejs
	} // node
} // timestamps
