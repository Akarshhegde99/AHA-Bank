exports.generateAccountNumber = () => {
    return 'BAN' + Math.floor(1000000000 + Math.random() * 9000000000);
};
