package com.printhub.service;

import com.printhub.model.AppConfig;
import com.printhub.repository.AppConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppConfigService {

    @Autowired
    private AppConfigRepository appConfigRepository;

    private static final String DEFAULT_KEY = "GLOBAL_SETTINGS";

    /**
     * Gets the current AppConfig. If it doesn't exist, it creates a default one.
     */
    public AppConfig getConfig() {
        return appConfigRepository.findAll().stream()
                .filter(config -> DEFAULT_KEY.equals(config.getConfigKey()))
                .findFirst()
                .orElseGet(() -> {
                    AppConfig newConfig = new AppConfig();
                    newConfig.setConfigKey(DEFAULT_KEY);
                    newConfig.setVendorProfitPercentage(2.0); // Default 2.0%
                    return appConfigRepository.save(newConfig);
                });
    }

    /**
     * Updates the vendor profit percentage globally.
     */
    @Transactional
    public AppConfig updateVendorProfitPercentage(Double percentage) {
        if (percentage < 0.0 || percentage > 100.0) {
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        }
        AppConfig config = getConfig();
        config.setVendorProfitPercentage(percentage);
        return appConfigRepository.save(config);
    }
}
