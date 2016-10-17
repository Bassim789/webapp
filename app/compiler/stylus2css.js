var folders = [
	'public',
	'admin',
	'app/error_catcher',
	'app/first_config'
]
class Compil_stylus {
	constructor(folders) {
		this.folders = folders
		this.walk = require('walk')
		this.exec = require('child_process').exec
		this.files = []
		this.nb_folder_started = 0
		this.run()
	}
	puts(error, stdout, stderr) {
		//console.log(stdout)
		if (error) console.log(error)
	}
	run() {
		for (var i in this.folders) {
			var walker = this.walk.walk('./' + this.folders[i], { followLinks: false })
			walker.on('file', (root, stat, next) => {
				if (stat.name.endsWith('.styl')) {
					var path_and_file = root + '/' + stat.name
					this.exec(`stylus --watch ${path_and_file} --out ${root}`, this.puts)
					this.files.push(root + '/' + stat.name)
				}
				next()
			})
			walker.on('end', () => {
				this.nb_folder_started += 1
				if (this.nb_folder_started === this.folders.length) {
					console.log(this.files.length + ' files compiled and now live updated')
				}
			})
		}
	}
}
new Compil_stylus(folders)