module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		shell: {
		  base_prepare: {
        command: [
          "rm -rf ./dist/*",
          "cp ./base/* ./dist"
        ].join("&&")
		  }
		}
	});
	grunt.loadNpmTasks("grunt-closure-compiler");
	grunt.loadNpmTasks("grunt-shell");
	grunt.registerTask("default", [ "shell" ]);
}
