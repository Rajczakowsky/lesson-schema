function addStringElement(element, canDropTo, oneliner) {
    return {
        menu: [
            deleteElement(element)
        ],
        hasText: true,
        oneliner: oneliner || false,
        asker: Xonomy.askString,
        canDropTo: canDropTo || []
    }
}

function deleteElement(elementName) {
    return {
        caption: 'Delete this ' + elementName,
        action: Xonomy.deleteElement
    }
}

function addMenuAttribute(attributeName, defaultValue, hideFunction) {
    var menuAttribute = {
        caption: 'Add @' + attributeName,
        action: Xonomy.newAttribute,
        actionParameter: {
            name: attributeName,
            value: defaultValue || '',
        }
    }

    menuAttribute.hideIf = hideFunction ? hideFunction : 
        function (jsElement) {
            return jsElement.hasAttribute(attributeName)
        };

    return menuAttribute;
}

function deleteAttribute(attributeName) {
    return {
        caption: 'Delete this @' + attributeName,
        action: Xonomy.deleteAttribute
    }
}

function isRequired(jsAttribute) {
    if(jsAttribute.value=='') {
        return Xonomy.warnings.push({
            htmlID: jsAttribute.htmlID,
            text: 'This attribute must not be empty.'}
        )
    };
}

function isCorrectAssetID(jsAttribute) {
    var re = /([A-Z]{3,6}[0-9]{5,6})/;
    if(!re.exec(jsAttribute.value)) {
        return Xonomy.warnings.push({
            htmlID: jsAttribute.htmlID,
            text: 'This is an invalid content id format. It should look like this: [VISUAL00001]'}
        )
    };
}


function include_add_section_option(type, text, hideFunction) {
    var action = "<section type=\"" + type + "\">";
    if (text) {
        action += text;
    }
    action += "</section>";
    var menu_item = {
        caption: "Add \"" + type + "\" type <section/>",
        action: Xonomy.newElementChild,
        actionParameter: action
    };
    if (hideFunction) {
        menu_item.hideIf = hideFunction;
    }

    return menu_item;
}

function buildElementCaptionText(element, display_name) {
    var elementName;
    var hasDisplayName = ( display_name !== undefined && display_name !== null );

    if (hasDisplayName) {
        elementName = display_name;
    } else {
        elementName = '<' + element + '/>';
    }

    var first_char = hasDisplayName ? elementName[0] : elementName[1];

    var elementMenuCaption = "Add ";

    if (['a', 'e', 'i', 'o', 'u'].indexOf(first_char.toLowerCase()) !== -1) {
        elementMenuCaption += "an ";
    } else {
        elementMenuCaption += "a ";
    }

    elementMenuCaption += elementName;

    return elementMenuCaption;

}

function buildElementWithAttributes(element, text, attributes) {

    var action = attributes ? '<' + element + ' ' + attributes +'/>' : '<' + element +'/>'

    return action;
}

function include_add_delete_options(element, display_name, attributes) {
    var action = build_action_parameter(element, null, attributes);
    var element_name = build_element_name(element, display_name);

    return [
        {
            caption: "Add a new " + element_name + " before this.",
            action: Xonomy.newElementBefore,
            actionParameter: action
        }, {
            caption: "Add a new " + element_name + " after this.",
            action: Xonomy.newElementAfter,
            actionParameter: action
        }, {
            caption: "Delete this " + element_name,
            action: Xonomy.deleteElement
        }];
}

function addMenuElement(element, text, display_name, hideFunction, attributes) {

    var menuElement = {
        caption: buildElementCaptionText(element, display_name),
        action: Xonomy.newElementChild,
        actionParameter: buildElementWithAttributes(element, text, attributes)
    };

    if (hideFunction) {
        menuElement.hideIf = hideFunction;
    }
    if (attributes) {
        menuElement.attributes = attributes;
    }
    return menuElement;
}
