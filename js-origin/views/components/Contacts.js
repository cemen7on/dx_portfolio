use('Views.Components').Contacts=Core.View.extend(function(){
    /**
     * Caption HTML element
     *
     * @type {null|HTMLElement}
     */
    this.captionEl=null;

    /**
     * Contacts list HTML element
     *
     * @type {null|HTMLElement}
     */
    this.listEl=null;

    this.attributes={
        class:'contacts'
    };

    this.events={
        'click .contacts__caption':function(){
            $(this.listEl).slideToggle(100);
        }.bind(this)
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
});