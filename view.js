/**
 * View represented by composite pattern
 * component - View
 * composite - CompositeView
 * favoring transparency over safety
 * means all the method handling for both leaf and composite will be defined inside the component
 * 
 */

class View {
    parent = null;

    init() {

    }

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

    init() {
        super.init();
        this.children = [];
    }

    add(node) {
        this.children.push(node);
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if(index !== -1) {
            this.children.splice(index, 1);
            return true;
        }
        return false;
    }
}