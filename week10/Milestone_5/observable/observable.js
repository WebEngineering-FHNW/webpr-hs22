

/**
 * @callback onValueChangeCallback<T>
 * @template T
 * @impure   this callback usually modifies the MVC view
 * @param    {T} newValue   - the new value that is set by the change
 * @param    {T} [oldValue] - the old value before the change. Can optionally be used by the callback.
 * @return   void
 */

/**
 * IObservable<T> is the interface from the GoF Observable design pattern.
 * In this variant, we allow to register many observers but do not provide means to unregister.
 * Observers are not garbage-collected before the observable itself is collected.
 * IObservables are intended to be used with the concept of "stable binding", i.e. with
 * listeners that do not change after setup.
 * @typedef IObservable<T>
 * @template T
 * @impure   Observables change their inner state (value) and maintain a list of observers that changes over time.
 * @property { ()  => T }   getValue - a function that returns the current value
 * @property { (T) => void} setValue - a function that sets a new value, calling all registered {@link onValueChangeCallback}s
 * @property { (callback: onValueChangeCallback<T>) => void } onChange -
 *              a function that registers an {@link onValueChangeCallback} that will be called whenever the value changes.
 *              Immediately called back on registration.
 */

/**
 * Constructor for an IObservable<T>.
 * @pure
 * @template T
 * @param    {!T} value      - the initial value to set. Mandatory.
 * @returns  IObservable<T>
 * @constructor
 * @example
 * const obs = Observable("");
 * obs.onChange(val => console.log(val));
 * obs.setValue("some other value");
 */

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


/**
 * @callback ObservableListCallback
 * @template _T_
 * @impure   this callback usually modifies the MVC view
 * @param {_T_} item - the item that has been added to or removed from the {@link IObservableList<_T_> }
 * @return void
 */

/**
 * @callback predicateCallback
 * @template _T_
 * @param {_T_} item - an item that is stored in the {@link IObservableList<_T_> }
 * @return boolean
 */

/**
 * IObservableList<T> is the interface for lists that can be observed for add or delete operations.
 * In this variant, we allow registering and unregistering many observers.
 * Observers that are still registered are not garbage collected before the observable list itself is collected.
 * @typedef IObservableList<_T_>
 * @template _T_
 * @impure   Observables change their inner decorated list and maintain two lists of observers that changes over time.
 * @property { (cb:ObservableListCallback<_T_>) => void }  onAdd - register an observer that is called whenever an item is added.
 * @property { (cb:ObservableListCallback<_T_>) => void }  onDel - register an observer that is called whenever an item is added.
 * @property { (_T_) => void }  add - add an item to the observable list and notify the observers. Modifies the list.
 * @property { (_T_) => void }  del - delete an item to the observable list and notify the observers. Modifies the list.
 * @property { (cb:ObservableListCallback<_T_>) => void }  removeAddListener - unregister the "add" observer
 * @property { (cb:ObservableListCallback<_T_>) => void }  removeDeleteListener - unregister the "delete" observer
 * @property { () => number }  count - current length of the inner list.
 * @property { (predicateCallback) => number }  countIf - number of items in the list that satisfy the given predicate.
 */

/**
 * Constructor for an IObservableList<T>.
 * @pure
 * @template _T_
 * @param {!Array<_T_>} list - the inner list that is to be decorated with observability. Mandatory. See also GoF decorator pattern.
 * @returns IObservableList<_T_>
 * @constructor
 * @example
 * const list = ObservableList( [] );
 * list.onAdd( item => console.log(item));
 * list.add(1);
 */

const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return /** @type {IObservableList} */ {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
