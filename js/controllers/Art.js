use('Controllers').Art=Core.Controller.extend(new function(){
    /**
     * Flag. Whether any of display section action has been called
     *
     * @type {boolean}
     */
    var _displayed=false;

    /**
     * Displays pictures section
     *
     * @param {object} collection. Collection to display
     * @param {null|object} data. Collection initialization data
     * @param {string} topNavCaptionMethod. Name of method to use in order to highlight top nav section
     * @param {string} asideCaption. Caption of aside menu
     * @private
     */
    var _displayPicturesSection=function(collection, data, topNavCaptionMethodName, asideCaption){
        var thumbsView,
            asideView;

        if(data){
            collection.set(data);
        }

        collection.fetch().then(function(){
            var picturesCollectionParams={
                collection:collection
            };

            if(_displayed){
                picturesCollectionParams.rollDown=false;
            }

            thumbsView=new Views.Art.PicturesCollection(picturesCollectionParams);
            asideView=new Views.Art.AsideCollection({
                collection:collection
            });

            Views.Layouts.TopNav.render()
                                .toTopLayer()
                                [topNavCaptionMethodName]()
                                .PictureNavRegion.empty(); // Empty region from previous view (Main.Index)

            var artLayout=Views.Layouts.Art;
            artLayout.render();

            artLayout.ThumbsRegion.display(thumbsView);

            artLayout.setAsideCaption(asideCaption);
            artLayout.AsideRegion.display(asideView);

            _displayed=true;
        });
    }.bind(this);

    /**
     * Displays "Animations" section
     *
     * @param {*} match. Query string match
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.animations=function(match, data){
        // TODO:..
        // _displayPicturesSection(new Collections.Animations(), data, 'highlightAnimationsCaption', 'Animations');
    };

    /**
     * Displays "Pictures 2d" section
     *
     * @param {*} match. Query string match
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.pictures2d=function(match, data){
        _displayPicturesSection(new Collections.Pictures2d(), data, 'highlightPictures2dCaption', 'Pictures 2d');
    };

    /**
     * Displays "Art 3d" section
     *
     * @param {*} match. Query string match
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.art3d=function(match, data){
        _displayPicturesSection(new Collections.Art3d(), data, 'highlightArt3dCaption', 'Art 3d');
    };

    this.modal=function(event, view){
        // TODO: добавить object Gallery

        var ratio,
            width=view.model.get('data').bigThumb.width,
            height=view.model.get('data').bigThumb.height;

        var defaults={
            minWidth:550,
            minHeight:550,

            maxWidth:$(window).width()-100,
            maxHeight:$(window).height()-100
        };

        if(width>defaults.maxWidth){
            ratio=defaults.maxWidth/width;

            width=defaults.maxWidth;
            height=height*ratio;
        }

        if(height>defaults.maxHeight){
            ratio=defaults.maxHeight/height;

            height=defaults.maxHeight;
            width=width*ratio;
        }

        var modal=new Components.Modal();

        modal.width=width;
        modal.height=height;
        modal.contentEl.style.lineHeight=height+'px';

        modal.content='<img src="'+Core.createAbsoluteUrl('/media/'+view.model.get('mediaId')+'/picture?type=big')+'" />';

        modal.show();
    };
});
