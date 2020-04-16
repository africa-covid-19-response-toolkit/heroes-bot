function checkchoice(from, to, value){
    if  (from <= Number(value) <= to){
        return true;
    }

    else 
      return false;
}

module.exports.checkchoice = checkchoice;