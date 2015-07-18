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
        _Gallery=null;
        _displayed=false;
    };

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
            collection.init(data);
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

            if(!_PaginationView){
                _PaginationView=new Views.Art.Pagination({
                    total:collection.total
                });

                artLayout.PaginationRegion.display(_PaginationView);
            }

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
    // this.animations=function(match, data){};

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
        _displayPicturesSection(new Collections.Pictures2d(), data, 'highlightPictures2dCaption', 'Pictures 2d');
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
        _displayPicturesSection(new Collections.Art3d(), data, 'highlightArt3dCaption', 'Art 3d');
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

        _Gallery.show(new Models.Media(view.model.get('data')));
    };
});
