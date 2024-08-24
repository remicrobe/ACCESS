import validator from 'validator';

export function checkRequiredField(fields: any) {
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        if (typeof field === 'object' && field.type === 'mail') { // Si le champ est un objet de type 'mail'
            if (!field.object || !validator.isEmail(field.object)) {
                return false;
            }
        } else { // Si le champ n'est pas un objet de type 'mail'
            if (field === null || field === '' || field === undefined) { // Vérifie si le champ est null, undefined ou ''
                return false;
            }
        }
    }
    return true;
}
