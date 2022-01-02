/**
 * Requirements :-
 * 1. this combines the model/view/controller architecture
 * 2. first the component initialize will be called, this initialize will do some start operations with the help of model supplied
 * 3. then the component will do first contentful render with the available information obtained from model
 * 4. model changes rerenders the component
 * 5. model hook in the component is called to get Model, this model whenever changes re-renders the component
 */
import Model, { ModelObserver } from './model.mjs';

class Component extends ModelObserver {
    constructor(props) {
        super();
        
        const model = this.model(props);
        this.init(props, model);
        if(model instanceof Model) {
            model.listen(this);
        }

        this.render();
    }

    init() {
        throw new Error('init hook should be present in the component');
    }

    model(props) {
        return {name: "shelton"};
    }

    update() {

    }

    render() {
        throw new Error('render method should be present in the component');
    }
}

export default Component;

class ViewComponent extends Component {
    model() {
        return {
            name: "Infant Antony Shelton"
        }
    }

    init(props, model) {
        console.log(props, model);
    }

    render() {
        console.log(this);
    }
}
