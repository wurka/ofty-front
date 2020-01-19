export function myClone(arg) {
  let a = JSON.stringify(arg);
  return (JSON.parse(a));
}

//this.$store.state.host,
//ax = this.$axios.create({  baseURL: this.host});
