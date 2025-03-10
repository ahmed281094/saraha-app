import  bcrypt  from 'bcrypt';

export const compareHashing = async({password,hashed})=>{
    return bcrypt.compareSync(password, hashed)
}