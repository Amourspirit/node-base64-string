module.exports = function (grunt) {
  grunt.initConfig({
    // pkg: packageData,
    env: {
      dev: {
        NODE_ENV: 'development',
        VERSION: function () {
          var j = grunt.file.readJSON('package.json');
          this.pkg = j;
          return j.version;
        }
      },
      build: {
        NODE_ENV: 'production',
        VERSION: function () {
          var j = grunt.file.readJSON('package.json');
          this.pkg = j;
          return j.version;
        }
      }
    },
    clean: {
      dirs: ['scratch', 'dist', 'lib'],
      files: [
        './index.js',
        './base64.min.js',
        './base64.min.js.map',
        'index.d.ts'
      ]
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      plugin: ['src/**/*.ts']
    },

    shell: {
      tsc: 'tsc',
      prepublish: 'npm test && npm run lint',
      version: 'git add .',
      postversion: 'git push && git push --tags'
    },
    remove_comments: {
      js: {
        options: {
          multiline: true, // Whether to remove multi-line block comments
          singleline: true, // Whether to remove the comment of a single line.
          keepSpecialComments: false, // Whether to keep special comments, like: /*! !*/
          linein: true, // Whether to remove a line-in comment that exists in the line of code, it can be interpreted as a single-line comment in the line of code with /* or //.
          isCssLinein: false // Whether the file currently being processed is a CSS file
        },
        cwd: 'lib/',
        src: '**/*.js',
        expand: true,
        dest: 'scratch/nc/'
      },
    },
    prettier: {
      format_js: {
        options: {
          singleQuote: true,
          printWidth: 120,
          trailingComma: 'all',
          tabWidth: 2,
          useTabs: true,
          endOfLine: 'lf',
          progress: false // By default, a progress bar is not shown. You can opt into this behavior by passing true.
        },
        files: {
          "index.js": 'scratch/nc/base64.js'
        }
      }
    },
    uglify: {
      js: {
        options: {
          sourceMap: true,
          mangle: true,
        },
        files: {
          "base64.min.js": 'lib/base64.js'
        }
      }
    },
    copy: {
      d: {
        files: [{
          // cwd: 'lib/',
          src: './lib/base64.d.ts',
          dest: './index.d.ts'
          // expand: false
        }]
      },
    },
    version_bump: {
      files: ['./package.json']
      // could not get callback to work
    },
  });
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-prettier');
  grunt.loadNpmTasks('grunt-remove-comments');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-version-bump');

  grunt.registerTask('default', [
    'version_bump:build',
    'build'
  ]);
  grunt.registerTask('patch', [
    'version_bump:patch',
    'env:build',
    'test',
    'gitver'
  ]);
  grunt.registerTask('envcheck', ['version_bump:build', 'env:dev', 'devtest']);
  grunt.registerTask('ver', function () {
    grunt.log.writeln('output from task ver');
    grunt.log.writeln("BUILD_VERSION:" + BUILD_VERSION);
    grunt.log.writeln("packageData.version:" + packageData.version);
  });
  grunt.registerTask('test', [
    'clean:dirs',
    'run_test'
  ]);
  grunt.registerTask('run_test', 'run mocha', function () {
    var done = this.async();
    // exec works with $(which mocha) except on travis ci below nodejs version 8
    // exec $(which node) $(which mocha) works on all tested versions
    require('child_process').exec('$(which node) $(which mocha)', function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
  grunt.registerTask('build', [
    'env:build',
  /*
   * Task clean: dirs
   * clean the folder out from any previous build
   */
    'clean:dirs',
    'clean:files',
    /*
     * Task tslint
     * check the ts files for any lint issues
     */
    'tslint',
    /*
     * Task shell: tsc
     * run tsc, outputs to /lib
     */
    'shell:tsc',
    'remove_comments:js',
    /**
     * Task shell: prettier
     * Runs prettier from package.json
     */
    'prettier:format_js',
    'uglify:js',
    'copy:d'
]);

  grunt.registerTask('gitver', [
    'env:build',
    'gitveradd',
    'gitvercommit',
    'gitvertag',
    'gitverpush'
  ]);
  // #region git
  grunt.registerTask('gitveradd', 'run git add', function () {
    var command = 'git add .';
    grunt.log.writeln("Executing command:" + command);
    var done = this.async();
    require('child_process').exec(command, function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
  grunt.registerTask('gitvercommit', 'run git commit', function () {
    var command = 'git commit -m "' + process.env.VERSION + '"';
    grunt.log.writeln("Executing command:" + command);
    var done = this.async();
    require('child_process').exec(command, function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
  grunt.registerTask('gitvertag', 'run git tag', function () {
    var command = 'git tag v' + process.env.VERSION;
    grunt.log.writeln("Executing command:" + command);
    var done = this.async();
    require('child_process').exec(command, function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
  grunt.registerTask('gitverpush', 'run git push', function () {
    var command = 'git push origin && git push --tag';
    grunt.log.writeln("Executing command:" + command);
    var done = this.async();
    require('child_process').exec(command, function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
  // #endregion
};