use('Views.Layouts').Main=Core.ViewLayout.extend(function(){
    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'click #logo':Controllers.App.captureRedirect
    };

    /**
     * Body HTML element
     *
     * @type {null|jQuery}
     */
    this.bodyEl=null;

    /**
     * Substrate HTML Element
     *
     * @type {null|HTMLElement}
     */
    this.substrateEl=null;

    /**
     * Logo HTML element
     *
     * @type {null|HTMLElement}
     */
    this.logoEl=null;

    this.render=function(){
        if(this.rendered){
            return this;
        }

        this.setElement(document.body);

        _renderBodyEl();
        _renderSubstrateEl();
        _renderLogoEl();
        _renderContactsEl();

        this.BodyRegion=new Core.Region(this.bodyEl);

        this.rendered=true;

        return this;
    };

    /**
     * Creates #body HTML element.
     * Appends it to DOM
     *
     * @private
     */
    var _renderBodyEl=function(){
        var bodyEl=document.createElement('div');
        bodyEl.id='body';

        this.bodyEl=bodyEl;

        this.el.appendChild(this.bodyEl);
    }.bind(this);

    /**
     * Creates substrate HTML element.
     * Appends it to DOM
     *
     * @private
     */
    var _renderSubstrateEl=function(){
        var substrate=document.createElement('div');
        substrate.id='substrate';
        // Substrate has to be in square shape
        substrate.style.height=window.innerWidth/2+'px';

        // Keep square shape if window resize
        window.addEventListener('resize', function(){
            substrate.style.height=window.innerWidth/2+'px';
        });

        this.substrateEl=substrate;
        this.el.appendChild(this.substrateEl);
    }.bind(this);

    /**
     * Creates logo HTML element.
     * Appends it to DOM
     *
     * @private
     */
    var _renderLogoEl=function(){
        var logoEl=document.createElement('a');
        logoEl.id='logo';
        logoEl.href=Core.createAbsoluteUrl('/');

        var imageEl=document.createElement('img');
        imageEl.src=Core.createAbsoluteUrl('/img/logo.png');

        logoEl.appendChild(imageEl);

        this.logoEl=logoEl;

        this.el.appendChild(this.logoEl);
    }.bind(this);

    /**
     * Renders contact element
     *
     * @private
     */
    var _renderContactsEl=function(){
        var contactsView=new Views.Components.Contacts();
        contactsView.render();

        this.el.appendChild(contactsView.el);
    }.bind(this);
});
