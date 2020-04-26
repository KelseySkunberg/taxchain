
async function getMessageSenderTypeFunc(taxChainContract, msgSenderAddress) {
    const res = await taxChainContract.methods.getMessageSenderAddressType()
                .call({from: msgSenderAddress});
    return res;
}

async function registerNewUserFunc(taxChainContract, userAddress,  userType, msgSenderAddress) {
    console.log(taxChainContract, userAddress, userType);
    if(userType == 'employee') {
        await taxChainContract.methods.registerEmployee(userAddress)
        .send({from: msgSenderAddress});
    }
    else if(userType == 'employer') {
        await taxChainContract.methods.registerEmployer(userAddress)
        .send({from: msgSenderAddress});
    }
}

async function getSalaryAmountsForEmployeeAndMonthFunc(taxChainContract, userAddress, month, msgSenderAddress) {
    const res = await taxChainContract.methods.getSalaryAmountsForEmployeeAndMonth(userAddress, month)
                .call({from: msgSenderAddress});
    console.log(res);
}


export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;
export const getSalaryAmountsForEmployeeAndMonth=getSalaryAmountsForEmployeeAndMonthFunc;