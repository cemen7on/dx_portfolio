use('Views.Components').Contacts=Core.View.extend(function(){
    /**
     * Contacts list slide duration
     *
     * @type {number}
     */
    var SLIDE_DURATION=100;

    /**
     * Caption HTML element
     *
     * @type {null|HTMLElement}
     */
    this.captionEl=null;

    /**
     * Contacts list HTML element field
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _listEl=null;

    /**
     * Contacts list HTML element property
     *
     * @type {null|HTMLElement}
     */
    Object.defineProperty(this, 'listEl', {
        get:function(){
            return _listEl;
        },
        set:function(value){
            _listEl=value;
            this.$listEl=$(value);
        }
    });

    /**
     * Whether dropdown is closed at the moment
     *
     * @type {boolean}
     * @private
     */
    var _isClosed=true;

    this.attributes={
        class:'contacts'
    };

    this.events={
        'click .contacts__caption':'slideToggle'
    };

    /**
     * Slides up list element
     *
     * @returns {*}
     */
    this.slideUp=function(){
        this.$listEl.slideUp(SLIDE_DURATION);

        _isClosed=true;

        return this;
    };

    /**
     * Slides down list element
     *
     * @returns {*}
     */
    this.slideDown=function(){
        this.$listEl.slideDown(SLIDE_DURATION);

        _isClosed=false;

        return this;
    };

    /**
     * Toggles state of list element
     *
     * @returns {*}
     */
    this.slideToggle=function(){
        if(_isClosed){
            this.slideDown();
        }
        else{
            this.slideUp();
        }

        return this;
    };

    this.render=function(){
        var captionBOMEl=document.createElement('div');
        captionBOMEl.className='contacts__caption';

        this.captionEl=_createCaptionEl();
        captionBOMEl.appendChild(this.captionEl);

        this.el.appendChild(captionBOMEl);

        var contactListBOMEl=document.createElement('div');
        contactListBOMEl.className='contacts__list';

        this.listEl=_createListEl();
        contactListBOMEl.appendChild(this.listEl);

        this.el.appendChild(contactListBOMEl);

        _addBlurEvent();
    };

    /**
     * Creates caption element
     *
     * @return {HTMLElement}
     * @private
     */
    var _createCaptionEl=function(){
        var captionEl=document.createElement('button');
        captionEl.className='contacts-caption';
        captionEl.textContent='Contacts';

        var iconEl=document.createElement('i');
        iconEl.className='fa fa-caret-down';

        captionEl.appendChild(iconEl);

        return captionEl;
    };

    /**
     * Returns contacts list element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createListEl=function(){
        var listEl=document.createElement('ul'),
            skypeContactEl=document.createElement('li'),
            emailContactEl=document.createElement('li');

        listEl.className='contacts-list';
        listEl.style.display='none';

        skypeContactEl.className='contacts-list__contact';
        skypeContactEl.textContent='Skype: DDDimaXXX';

        listEl.appendChild(skypeContactEl);

        emailContactEl.className='contacts-list__contact';
        emailContactEl.textContent='E-mail: chpsemenov@yandex.ru';

        listEl.appendChild(emailContactEl);

        return listEl;
    };

    /**
     * Registers click event on body, for simulation of blur event os dropdown,
     * i.e. when any element outside of dropdown is clicked - dropdown is closed
     *
     * @private
     */
    var _addBlurEvent=function(){
        var closure=this;

        document.body.addEventListener('click', function(e){
            var $target=$(e.target);

            // If drop down is closed - don't need to try anything
            if(_isClosed){
                return ;
            }

            // If it's current element or child of current element
            if($target==closure.$el || $target.parents('.contacts').size()){
                return ;
            }

            closure.slideUp();
        });
    }.bind(this);
});