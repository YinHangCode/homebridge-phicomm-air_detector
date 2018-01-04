const PhicommAirDetectorBaseParser = require('./PhicommAirDetectorBaseParser');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

class PhicommAirDetectorM1Parser extends PhicommAirDetectorBaseParser {
    constructor(platform) {
        super(platform);
        
        Accessory = platform.Accessory;
        PlatformAccessory = platform.PlatformAccessory;
        Service = platform.Service;
        Characteristic = platform.Characteristic;
        UUIDGen = platform.UUIDGen;
    }
    
    parser(deviceMacStr, dataStr) {
        var that = this;
        
        that.parserTemperatureAccessory(deviceMacStr, dataStr);
        that.parserHumidityAccessory(deviceMacStr, dataStr);
        that.parserAirQualityAccessory(deviceMacStr, dataStr);
        that.parserLightbulbAccessory(deviceMacStr, dataStr);
    }
    
    parserTemperatureAccessory(deviceMacStr, dataStr) {
        var that = this;
        
        var accessoryName = that.platform.ConfigUtil.getDeviceName(deviceMacStr, 'temperatureName');
        var uuid = UUIDGen.generate('PhicommAirDetectorPlatform_' + deviceMacStr + '_Temperature');
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(null == accessory) {
            accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
            accessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, "Phicomm")
                .setCharacteristic(Characteristic.Model, "M1")
                .setCharacteristic(Characteristic.SerialNumber, deviceMacStr);
            accessory.addService(Service.TemperatureSensor, accessoryName);
            that.platform.api.registerPlatformAccessories('homebridge-phicomm-air_detector', 'PhicommAirDetectorPlatform', [accessory]);
            that.platform.AccessoryUtil.add(accessory);
        }
        
        var service = accessory.getService(Service.TemperatureSensor);
        var currentTemperatureCharacteristic = service.getCharacteristic(Characteristic.CurrentTemperature);
        
        var dataObj = JSON.parse(dataStr);
        currentTemperatureCharacteristic.updateValue(dataObj['temperature']);
        
        if(currentTemperatureCharacteristic.listeners('get').length == 0) {
            currentTemperatureCharacteristic.on("get", function(callback) {
                callback(null, currentTemperatureCharacteristic.value);
            });
        }
    }
    
    parserHumidityAccessory(deviceMacStr, dataStr) {
        var that = this;
        
        var accessoryName = that.platform.ConfigUtil.getDeviceName(deviceMacStr, 'humidityName');
        var uuid = UUIDGen.generate('PhicommAirDetectorPlatform_' + deviceMacStr + '_Humidity');
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(null == accessory) {
            accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
            accessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, "Phicomm")
                .setCharacteristic(Characteristic.Model, "M1")
                .setCharacteristic(Characteristic.SerialNumber, deviceMacStr);
            accessory.addService(Service.HumiditySensor, accessoryName);
            that.platform.api.registerPlatformAccessories('homebridge-phicomm-air_detector', 'PhicommAirDetectorPlatform', [accessory]);
            that.platform.AccessoryUtil.add(accessory);
        }
        
        var service = accessory.getService(Service.HumiditySensor);
        var currentRelativeHumidityCharacteristic = service.getCharacteristic(Characteristic.CurrentRelativeHumidity);
        
        var dataObj = JSON.parse(dataStr);
        currentRelativeHumidityCharacteristic.updateValue(dataObj['humidity']);
        
        if(currentRelativeHumidityCharacteristic.listeners('get').length == 0) {
            currentRelativeHumidityCharacteristic.on("get", function(callback) {
                callback(null, currentRelativeHumidityCharacteristic.value);
            });
        }
    }
    
    parserAirQualityAccessory(deviceMacStr, dataStr) {
        var that = this;
        
        var accessoryName = that.platform.ConfigUtil.getDeviceName(deviceMacStr, 'airQualityName');
        var uuid = UUIDGen.generate('PhicommAirDetectorPlatform_' + deviceMacStr + '_AirQualitySensor');
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(null == accessory) {
            accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.SENSOR);
            accessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, "Phicomm")
                .setCharacteristic(Characteristic.Model, "M1")
                .setCharacteristic(Characteristic.SerialNumber, deviceMacStr);
            var service = accessory.addService(Service.AirQualitySensor, accessoryName);
            service.addCharacteristic(Characteristic.PM2_5Density);
            service.addCharacteristic(Characteristic.VOCDensity);
            that.platform.api.registerPlatformAccessories('homebridge-phicomm-air_detector', 'PhicommAirDetectorPlatform', [accessory]);
            that.platform.AccessoryUtil.add(accessory);
        }
        
        var service = accessory.getService(Service.AirQualitySensor);
        var airQualityCharacteristic = service.getCharacteristic(Characteristic.AirQuality)
        var pm2_5Characteristic = service.getCharacteristic(Characteristic.PM2_5Density);
        var vocCharacteristic = service.getCharacteristic(Characteristic.VOCDensity);
        
        var dataObj = JSON.parse(dataStr);
        pm2_5Characteristic.updateValue(dataObj['value']);
        vocCharacteristic.updateValue(dataObj['hcho']);
        if(pm2_5Characteristic.value <= 50) {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.EXCELLENT);
        } else if(pm2_5Characteristic.value > 50 && pm2_5Characteristic.value <= 100) {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.GOOD);
        } else if(pm2_5Characteristic.value > 100 && pm2_5Characteristic.value <= 200) {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.FAIR);
        } else if(pm2_5Characteristic.value > 200 && pm2_5Characteristic.value <= 300) {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.INFERIOR);
        } else if(pm2_5Characteristic.value > 300) {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.POOR);
        } else {
            airQualityCharacteristic.updateValue(Characteristic.AirQuality.UNKNOWN);
        }
        
        if(pm2_5Characteristic.listeners('get').length == 0) {
            pm2_5Characteristic.on("get", function(callback) {
                callback(null, pm2_5Characteristic.value);
            });
        }
        
        if(vocCharacteristic.listeners('get').length == 0) {
            vocCharacteristic.on("get", function(callback) {
                callback(null, vocCharacteristic.value);
            });
        }
    }
    
    parserLightbulbAccessory(deviceMacStr, dataStr) {
        var that = this;
        
        var accessoryName = that.platform.ConfigUtil.getDeviceName(deviceMacStr, 'ledBulbName');
        var uuid = UUIDGen.generate('PhicommAirDetectorPlatform_' + deviceMacStr + '_Lightbulb');
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(null == accessory) {
            accessory = new PlatformAccessory(accessoryName, uuid, Accessory.Categories.LIGHTBULB);
            accessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, "Phicomm")
                .setCharacteristic(Characteristic.Model, "M1")
                .setCharacteristic(Characteristic.SerialNumber, deviceMacStr);
            var service = accessory.addService(Service.Lightbulb, accessoryName);
            service.addCharacteristic(Characteristic.Brightness);
            that.platform.api.registerPlatformAccessories('homebridge-phicomm-air_detector', 'PhicommAirDetectorPlatform', [accessory]);
            that.platform.AccessoryUtil.add(accessory);
        }
        
        var service = accessory.getService(Service.Lightbulb);
        var switchCharacteristic = service.getCharacteristic(Characteristic.On);
        var brightnessCharacteristic = service.getCharacteristic(Characteristic.Brightness);
        
        var dataObj = JSON.parse(dataStr);
        switchCharacteristic.updateValue(true);
        brightnessCharacteristic.updateValue(100);
        
        if(switchCharacteristic.listeners('get').length == 0) {
            switchCharacteristic.on("get", function(callback) {
                callback(null, switchCharacteristic.value);
            });
        }
        if(brightnessCharacteristic.listeners('get').length == 0) {
            brightnessCharacteristic.on("get", function(callback) {
                callback(null, brightnessCharacteristic.value);
            });
        }
    }
}

module.exports = PhicommAirDetectorM1Parser;

