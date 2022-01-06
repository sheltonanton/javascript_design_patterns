/**
 * View represented by composite pattern
 * component - View
 * composite - CompositeView
 * favoring transparency over safety
 * means all the method handling for both leaf and composite will be defined inside the component
 */

class View {
    parent = null;

    add() {
        throw new Error("Cannot add a node as a child to leaf component");
    }
    remove() {
        this.parent && this.parent.removeChild(this);
        this.parent = null;
    }
    removeChild() {
        throw new Error("Cannot remove child from leaf component");
    }
    render() {
        throw new Error("Render method should be implemented");
    }
}

class CompositeView extends View {
    children = null;

    constructor() {
        super();
        this.children = [];
    }
    add(node) {
        if(node instanceof View) {
            this.children.push(node);
        }else{
            throw new Error('not a valid View instance');
        }
    }
    removeChild(node) {
        const index = this.children.indexOf(node);
        if(index !== -1) {
            this.children.splice(index, 1);
            return true;
        }
        return false;
    }
    triggerRender() {
        this.render();
        this.children.forEach(child => {
            child.triggerRender();
        });
    }
}
