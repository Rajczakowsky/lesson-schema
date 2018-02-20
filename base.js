function addMenuItems(attributes, elements, currentElement, hideElementIfOne) {
    var menuItems = [];

    if (attributes !== null) {
        attributes.forEach( function (attribute){
            menuItems.push(
                addMenuAttribute(attribute)
            )
        });
    }

    if (elements !== null) {
        elements.forEach( function (element){
            menuItems.push(
                addMenuElement(element, currentElement, hideElementIfOne),
            )
        });
    }

    if (currentElement !== null) {
        menuItems.push(
            deleteElement(currentElement)
        );
    }

    return menuItems;
}

function addMenuElement(element, hideElementIfOne) {
    var elementText = (element.replace(/[^a-zA-Z ]/g, ''));

    return {
        caption: 'Add '+ element,
        action: Xonomy.newElementChild,
        actionParameter: element,
        hideIf: function(jsElement) {
            if (hideElementIfOne) {
                return jsElement.hasChildElement(elementText);
            } else {
                return false;
            }
        }
    }
}

function addOneLinerStringElement(element) {
    return {
        menu: [
            deleteElement(element)
        ],
        hasText: true,
        oneliner: true,
        asker: Xonomy.askString,
    }
}

function deleteElement(elementName) {
    return {
        caption: 'Delete this ' + elementName,
        action: Xonomy.deleteElement
    }
}

function addMenuAttribute(attributeName, defaultValue) {
    return {
        caption: 'Add @' + attributeName,
        action: Xonomy.newAttribute,
        actionParameter: {
            name: attributeName,
            value: defaultValue || '',
        },
        hideIf: function(jsElement){
            return jsElement.hasAttribute(attributeName);
        }
    }
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


