class ConfigUtil {
    constructor(config) {
        this.config = config;
        
    }
    
    getListenPort() {
        return this.config['listenPort'];
    }
    
    getForwardAddress() {
        return this.config['forwardAddress'];
    }
    
    getDeviceConfig(deviceMacStr) {
        var deviceCfgs = this.config['deviceCfgs'];
        if(deviceCfgs instanceof Array) {
            for (var i = 0; i < deviceCfgs.length; i++) {
                var deviceCfg = deviceCfgs[i];
//              if(null == deviceCfg['type'] || "" == deviceCfg['type']) {
//                  continue;
//              }
                if(null == deviceCfg['mac'] || "" == deviceCfg['mac']) {
                    continue;
                }
                
                if(deviceCfg['mac'] == deviceMacStr) {
                    return deviceCfg;
                }
            }
        }
        return null;
    }
    
    getDeviceName(deviceMacStr, name) {
        var deviceConfig = this.getDeviceConfig(deviceMacStr);
        if(deviceConfig) {
            return deviceConfig[name];
        }
        return 'temp';
    }
}

module.exports = ConfigUtil;