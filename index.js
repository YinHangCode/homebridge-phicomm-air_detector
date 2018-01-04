const PhicommAirDetectorM1Parser = require('./DevicesParser/PhicommAirDetectorM1Parser');

const net = require('net');

const LogUtil = require('./lib/LogUtil');
const ConfigUtil = require('./lib/ConfigUtil');
const AccessoryUtil = require('./lib/AccessoryUtil');

var fs = require('fs');
var packageFile = require("./package.json");
var PlatformAccessory, Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    if(!isConfig(homebridge.user.configPath(), "platforms", "PhicommAirDetectorPlatform")) {
        return;
    }
    
    PlatformAccessory = homebridge.platformAccessory;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerPlatform('homebridge-phicomm-air_detector', 'PhicommAirDetectorPlatform', PhicommAirDetectorPlatform, true);
}

function isConfig(configFile, type, name) {
    var config = JSON.parse(fs.readFileSync(configFile));
    if("accessories" === type) {
        var accessories = config.accessories;
        for(var i in accessories) {
            if(accessories[i]['accessory'] === name) {
                return true;
            }
        }
    } else if("platforms" === type) {
        var platforms = config.platforms;
        for(var i in platforms) {
            if(platforms[i]['platform'] === name) {
                return true;
            }
        }
    } else {
    }
    
    return false;
}

function PhicommAirDetectorPlatform(log, config, api) {
    if(null == config) {
        return;
    }
    
    this.Accessory = Accessory;
    this.PlatformAccessory = PlatformAccessory;
    this.Service = Service;
    this.Characteristic = Characteristic;
    this.UUIDGen = UUIDGen;
    
    if(api) {
        this.api = api;
    }
    
    this.log = new LogUtil(null, log);
    this.ConfigUtil = new ConfigUtil(config);
    this.AccessoryUtil = new AccessoryUtil();
    
    this.initServerSocket();
    this.doRestThings();
    
    this.parsers = {
        'm1': new PhicommAirDetectorM1Parser(this)
    }
    
    this.log.info("************************************************************************");
    this.log.info("          PhicommAirDetectorPlatform v"+packageFile.version+" By YinHang");
    this.log.info(" GitHub: https://github.com/YinHangCode/homebridge-phicomm-air_detector ");
    this.log.info("                                                   QQ Group: 107927710  ");
    this.log.info("************************************************************************");
    this.log.info("start success...");
}

PhicommAirDetectorPlatform.prototype.configureAccessory = function(accessory) {
    this.AccessoryUtil.add(accessory);
}

PhicommAirDetectorPlatform.prototype.initServerSocket = function() {
    var that = this;

    net.createServer(function(socket) {
        socket.on('data', that.parseMessage.bind(that));
    }).listen(that.ConfigUtil.getListenPort());
    that.log.info("server is listening on tcp port " + that.ConfigUtil.getListenPort() + ".");
}

PhicommAirDetectorPlatform.prototype.parseMessage = function(data) {
    var that = this;
    
    if(data.length > 34) {
        var sourceMac = Buffer.alloc(6);
        data.copy(sourceMac, 0, 17, 23);
        var sourceMacStr = that.getString(sourceMac).replace(/\s+/g, '').toUpperCase();
        var dataStr = data.toString('utf8', 28, data.length - 6);
        
        that.log.debug(sourceMacStr);
        that.log.debug(dataStr);
        
        if(that.ConfigUtil.getDeviceConfig(sourceMacStr)) {
            that.parsers['m1'].parser(sourceMacStr, dataStr);
        }
    }
}

PhicommAirDetectorPlatform.prototype.getString = function(data) {
    if(typeof data == "string") {
        return data;
    } else if(data instanceof Buffer) {
        var jsonStr = JSON.stringify(data);
        var jsonObj = JSON.parse(jsonStr);
        var dataObj = jsonObj['data'];
        var r = "";
        for(var i in dataObj) {
            r += (dataObj[i].toString(16).toUpperCase().length < 2 ? ('0' + dataObj[i].toString(16).toUpperCase()) : dataObj[i].toString(16).toUpperCase()) + " ";
        }
        return r;
    } else {
    }
}

PhicommAirDetectorPlatform.prototype.doRestThings = function(api) {
    var that = this;
    /*
    that.api.on('didFinishLaunching', function() {
        var deviceCfgs = that.config['deviceCfgs'];
        if(deviceCfgs instanceof Array) {
            for (var i = 0; i < deviceCfgs.length; i++) {
                var deviceCfg = deviceCfgs[i];
                if(null == deviceCfg['type'] || "" == deviceCfg['type'] || null == deviceCfg['mac'] || "" == deviceCfg['mac']) {
                    continue;
                }
                
                if(deviceCfg['type'] in that.parsers) {
                    that.parsers[deviceCfg['type']].parser(deviceCfg);
                }
            }
        }
        that.api.unregisterPlatformAccessories("homebridge-simens-switch", "SimensSwitchPlatform", that.AccessoryDeleteUtil.getArrAll());
        delete that.AccessoryDeleteUtil;
    });*/
}