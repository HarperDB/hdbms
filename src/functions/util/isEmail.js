export default (email) => /^\S+@\S+\.\S+$/.test(String(email).toLowerCase());
