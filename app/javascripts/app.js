//连接以太坊
window.onload = function() {
	web3.eth.getAccounts(function(err, accs) {
		if (err !== null) {
			//如果没有开启以太坊客户端(TestRPC、geth私有链)，则无法获取账号
			alert("无法连接到以太坊客户端...");
			return;
		}
		if (accs.length ===0) {
			//没有以太坊账号
			alert("获得的账号为空");
			return;
		}
		accounts = accs;
		account = accounts[0];  //以第一个默认账号作为调用合约的账号
		contractAddr = Score.deployed();  //获得合约地址
		console.log("合约地址: " + contractAddr.address);
	});
}

//客户/商户注册
//注册一个客户:需要指定gas，默认gas值会出现out of gas
function newCustomer() {
	var address = document.getElementById("customerAddress").value;
	var password = document.getElementById("customerPassword").value;
	contractAddr.newCustomer(address, password, {from: account, gas: 1000000}).then(function() {
        var eventNewCustomer = contractAddr.NewCustomer();
        eventNewCustomer.watch(function(error, event) {
            console.log(event.args.message);
            alert(event.args.message);
            eventNewCustomer.stopWatching();  //一定要停止监听
        });
	});
}

//客户/商户登录
function customerLogin() {
	var address = document.getElementById("customerLoginAddr").value;
	var password = document.getElementById("customerLoginPwd").value;
	contractAddr.getCustomerPassword(address, {from: account}).then(function(result) {
		console.log(password);
		console.log(hexCharCodeToStr(result[1]));
		if (result[0]){
			//查询密码成功
			if (password.localeCompare(hexCharCodeToStr(result[1])) ===0 ) {
				console.log("登录成功");
				//跳转到用户界面
				location.href="customer.html?account=" + address;
			}
			else {
				console.log("密码错误，登录失败");
				alert("密码错误，登录失败");
			}
		}
		else {
			//查询密码失败
			console.log("该用户不存在，请确定账号后再登录！");
			alert("该用户不存在，请确定账号后再登录！")
		}
	});
}