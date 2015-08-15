use('Controllers').Art=Core.Controller.extend(new function(){
    /**
     * Flag. Whether any of display section action has been called
     *
     * @type {boolean}
     */
    var _displayed=false;

    /**
     * Pagination view instance.
     * Is singleton throw one section
     *
     * @type {null|Views.Art.Pagination}
     * @private
     */
    var _PaginationView=null;

    /**
     * Current action's name
     *
     * @type {string}
     * @private
     */
    var _currentAction='';

    /**
     * Gallery instance
     *
     * @type {null|Components.Gallery}
     * @private
     */
    var _Gallery=null;

    /**
     * YouTube API player instance
     *
     * @type {null|Components.Player}
     * @private
     */
    var _Player=null;

    /**
     * If passed action is not current action  - clear objects state
     *
     * @param {string} actionName. Action's name that was triggered
     * @private
     */
    var _transitAction=function(actionName){
        if(actionName==_currentAction){
            return ;
        }

        _currentAction=actionName;
        _clearState();
    };

    /**
     * Removes currently saved objects
     *
     * @private
     */
    var _clearState=function(){
        _PaginationView=null;
        _displayed=false;

        if(_Gallery){
            _Gallery.clearState();
        }
    };

    /**
     * Displays pictures section
     *
     * @param {function} ModelCollectionConstructor. Models collection constructor
     * @param {function} ThumbCollectionConstructor. View Thumbs collection constructor
     * @param {null|object} data. Collection initialization data
     * @param {string} topNavCaptionMethod. Name of method to use in order to highlight top nav section
     * @param {string} asideCaption. Caption of aside menu
     * @private
     */
    var _displayPicturesSection=function(ModelCollectionConstructor, ThumbCollectionConstructor, data, topNavCaptionMethodName, asideCaption){
        var modelCollection=new ModelCollectionConstructor(),
            thumbsView,
            asideView;

        if(data){
            modelCollection.init(data);
        }

        modelCollection.fetch().then(function(){
            var thumbsCollectionParams={
                collection:modelCollection
            };

            if(_displayed){
                thumbsCollectionParams.rollDown=false;
            }

            thumbsView=new ThumbCollectionConstructor(thumbsCollectionParams);
            asideView=new Views.Art.AsideCollection({
                collection:modelCollection
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

            if(!_PaginationView){
                _PaginationView=new Views.Art.Pagination({
                    total:modelCollection.total
                });

                artLayout.PaginationRegion.display(_PaginationView);
            }

            _displayed=true;
        });
    }.bind(this);

    /**
     * Displays "Animations" section
     *
     * @param {*} pageId. Current page's id
     * @param {null|string} queryString. Request query string
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.animations=function(pageId, queryString, data){
        _transitAction('animations');
        _displayPicturesSection(Collections.Videos, Views.Art.VideosCollection, data, 'highlightAnimationsCaption', 'Animations');
    };

    /**
     * Displays "Pictures 2d" section
     *
     * @param {*} pageId. Current page's id
     * @param {null|string} queryString. Request query string
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.pictures2d=function(pageId, queryString, data){
        _transitAction('pictures2d');
        _displayPicturesSection(Collections.Pictures2d, Views.Art.PicturesCollection, data, 'highlightPictures2dCaption', 'Pictures 2d');
    };

    /**
     * Displays "Art 3d" section
     *
     * @param {*} pageId. Current page's id
     * @param {null|string} queryString. Request query string
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.art3d=function(pageId, queryString, data){
        _transitAction('art3d');
        _displayPicturesSection(Collections.Art3d, Views.Art.PicturesCollection, data, 'highlightArt3dCaption', 'Art 3d');
    };

    /**
     * Controller's blur method.
     * Is called implicitly when route has been changed,
     * before calling another controller's action
     */
    this.blur=function(){
        _clearState();
    };

    /**
     * Opens thumb in gallery modal window
     *
     * @param {Event} event. HTML Event object
     * @param {Core.View} view. View's object, event triggered from
     */
    this.modal=function(event, view){
        if(!_Gallery){
            _Gallery=new Components.Gallery();
        }

        _Gallery.show(view.model);
    };

    /**
     * Plays video
     *
     * @param {Event} event. HTML Event object
     * @param {Core.View} view. View's object, event triggered from
     */
    this.play=function(event, view){
        if(!_Player){
            _Player=new Components.Player();
        }

        _Player.play(view.model.get('ytId'));
    };
});
