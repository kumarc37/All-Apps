//import Mixin from '@ember/object/mixin';
import { getOwner } from "@ember/application";
import { inject as service } from "@ember/service";

export function init(this) {
    const componentName = (this._debugContainerKey || "").replace(
        "component:",
        ""
      );
  
      if (this.actions) {
        Object.keys(this.actions).forEach((key) => {
          if (this.metricsEnabledActionsExclusions.indexOf(key) === -1) {
            this.override(
              this.actions,
              key,
              this.after(() => {
                this.trackEvent(key, componentName, "action");
              })
            );
          }
        });
      }
  
      let eventDispatcher = getOwner(this).lookup("event_dispatcher:main");
      let events = (eventDispatcher && eventDispatcher._finalEvents) || {};
  
      Object.keys(events).forEach((key) => {
        this.override(
          this,
          events[key],
          this.after(() => {
            this.trackEvent(events[key], componentName, "event");
          })
        );
      });
  
      this._super(...arguments);
    
}

export function findText(el, text) {
  for (let i = 0; i < el.children.length; i++) {
    let child = el.children[i];
    if (child.type === "#text") {
      text = `${text} ${child.text}`.trim();
      findText(child, text); /* eslint no-undef: 0  */
    }
  }

  return text.length ? `${el.innerText} ${text}` : el.innerText;
}

export function override(object, methodName, callback) {
  if (typeof object[methodName] === "function") {
    object[methodName] = callback(object[methodName]);
  }
}
export function after(extraBehavior) {
  return function (original) {
    return function () {
      let returnValue = original.apply(this, arguments);
      extraBehavior.apply(this, arguments);
      return returnValue;
    };
  };
}
export function trackEvent(this,key, componentName, eventType) {
    const yardPrefix = `${this.get(
      "configService.config.metrics.yard.eventTag"
    )}`;
    let text = "";

    /**
     * Send element's inner text to yard for all elements, except the one's with sendInnerText=false
     */
    if (
      this.sendInnerText !== false &&
      this.sendInnerText !== "false" &&
      this.element
    ) {
      text = this.findText(this.element, "").trim();
    }
    if (this.element) {
      this._metrics.trackEvent({
        componentName,
        key,
        yardPrefix,
        text,
        category: eventType,
      });
    }
  }
export default Mixin.create({
  /**
   * Add the Analytics services to each route so it's available.
   * @public
   * @memberOf {MetricsEnabledActions}
   * @type {Service.Analytics}
   */
  _metrics: service("metrics"),
  configService: service(),
  /**
   This property needs to be overridden in the component in which the mixin is applied
   if there are any actions which need to be ignored 
  */
  metricsEnabledActionsExclusions: [],

  init() {
    const componentName = (this._debugContainerKey || "").replace(
      "component:",
      ""
    );

    if (this.actions) {
      Object.keys(this.actions).forEach((key) => {
        if (this.metricsEnabledActionsExclusions.indexOf(key) === -1) {
          this.override(
            this.actions,
            key,
            this.after(() => {
              this.trackEvent(key, componentName, "action");
            })
          );
        }
      });
    }

    let eventDispatcher = getOwner(this).lookup("event_dispatcher:main");
    let events = (eventDispatcher && eventDispatcher._finalEvents) || {};

    Object.keys(events).forEach((key) => {
      this.override(
        this,
        events[key],
        this.after(() => {
          this.trackEvent(events[key], componentName, "event");
        })
      );
    });

    this._super(...arguments);
  },

  findText(el, text) {
    for (let i = 0; i < el.children.length; i++) {
      let child = el.children[i];
      if (child.type === "#text") {
        text = `${text} ${child.text}`.trim();
        findText(child, text); /* eslint no-undef: 0  */
      }
    }

    return text.length ? `${el.innerText} ${text}` : el.innerText;
  },

  override(object, methodName, callback) {
    if (typeof object[methodName] === "function") {
      object[methodName] = callback(object[methodName]);
    }
  },

  after(extraBehavior) {
    return function (original) {
      return function () {
        let returnValue = original.apply(this, arguments);
        extraBehavior.apply(this, arguments);
        return returnValue;
      };
    };
  },

  trackEvent(key, componentName, eventType) {
    const yardPrefix = `${this.get(
      "configService.config.metrics.yard.eventTag"
    )}`;
    let text = "";

    /**
     * Send element's inner text to yard for all elements, except the one's with sendInnerText=false
     */
    if (
      this.sendInnerText !== false &&
      this.sendInnerText !== "false" &&
      this.element
    ) {
      text = this.findText(this.element, "").trim();
    }
    if (this.element) {
      this._metrics.trackEvent({
        componentName,
        key,
        yardPrefix,
        text,
        category: eventType,
      });
    }
  },
});
