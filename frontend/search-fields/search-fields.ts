import FieldImage from "../lib/interface"

export function searchFields(nameImage: string, node: {}){
  let nameFieldImage: FieldImage | undefined;
  for (let key in node) {
    if (node.hasOwnProperty(key)) {
        if (nameImage == key) {
            nameFieldImage = node[key]
            return nameFieldImage
        }
    }
}
}
