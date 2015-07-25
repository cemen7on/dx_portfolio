module.exports=function(grunt){
 
    // Project configuration.
    grunt.initConfig({
 
        //Read the package.json (optional)
        pkg:grunt.file.readJSON('package.json'),
 
        // Metadata.
        meta:{
            basePath:'/',
            jsOriginPath:'../js-origin/',
            jsDeployPath:'../js/',

            cssOriginPath:'../css-origin/',
            cssDeployPath:'../css/'
        },
 
        concat:{
            css:{
                src:[
                    '<%=meta.cssOriginPath%>nav/*.css',
                    '<%=meta.cssOriginPath%>modal/*.css',
                    '<%=meta.cssOriginPath%>pagination/*.css',
                    '<%=meta.cssOriginPath%>*.css'
                ],
                dest:'<%=meta.cssDeployPath%>styles.css'
            }
        },

        cssmin: {
            options:{
                advanced:false
            },
            rollup:{
                files:{
                    src:'<%=meta.cssDeployPath%>styles.css',
                    dest:'<%=meta.cssDeployPath%>styles.css'
                }
            }
        },
		
		uglify:{
			options:{
				sourceMap:false
			},
			build:{
				files:{
                    '<%=meta.jsDeployPath%>application.js':[
                        '<%=meta.jsOriginPath%>backbone/underscore.js',
                        '<%=meta.jsOriginPath%>backbone/*.js',
                        '<%=meta.jsOriginPath%>core/define.js',
                        '<%=meta.jsOriginPath%>core/Core.js',
                        '<%=meta.jsOriginPath%>core/components/*.js',
                        '<%=meta.jsOriginPath%>core/*.js',
                        '<%=meta.jsOriginPath%>extensions/youtube/youtube.js',
                        '<%=meta.jsOriginPath%>extensions/youtube/*.js',
                        '<%=meta.jsOriginPath%>extensions/jquery/*.js',
                        '<%=meta.jsOriginPath%>components/Container.js',
                        '<%=meta.jsOriginPath%>components/Modal.js',
                        '<%=meta.jsOriginPath%>components/*.js',
                        '<%=meta.jsOriginPath%>models/*.js',
                        '<%=meta.jsOriginPath%>collections/ArtCollection.js',
                        '<%=meta.jsOriginPath%>collections/*.js',
                        '<%=meta.jsOriginPath%>controllers/*.js',
                        '<%=meta.jsOriginPath%>views/art/Thumb.js',
                        '<%=meta.jsOriginPath%>views/art/ThumbsCollection.js',
                        '<%=meta.jsOriginPath%>views/art/*.js',
                        '<%=meta.jsOriginPath%>views/layouts/*.js',
                        '<%=meta.jsOriginPath%>views/main/*.js',
                        '<%=meta.jsOriginPath%>index.js'
                    ]
				}
			}
		}
    });
 
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['concat', 'cssmin', 'uglify']);
};