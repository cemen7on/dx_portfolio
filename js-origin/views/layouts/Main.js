use('Views.Layouts').Main=Core.ViewLayout.extend(function(){
    /**
     * Element's tag name
     *
     * @type {string}
     */
    this.tagName='div';

    /**
     * Attributes list of element
     *
     * @type {object}
     */
    this.attributes={
        id:'body'
    };

    this.render=function(){
        if(this.rendered){
            return this;
        }

        var documentBody=document.body;
            // allBodyNodes=documentBody.childNodes;

        /*
        for(var i=0, end=allBodyNodes.length; i<end; i++){
            allBodyNodes[i].parentNode.removeChild(allBodyNodes[i]);
        }
        */

        var substrate=document.createElement('div');
        substrate.id='substrate';
        // Substrate has to be in square shape
        substrate.style.height=window.innerWidth/2+'px';

        // Keep square shape if window resize
        window.addEventListener('resize', function(){
            substrate.style.height=window.innerWidth/2+'px';
        });

        documentBody.appendChild(substrate);
        documentBody.appendChild(this.el);

        this.rendered=true;

        return this;
    };
});
