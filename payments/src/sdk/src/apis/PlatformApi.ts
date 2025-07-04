/* tslint:disable */
/* eslint-disable */
/**
 * Fanno Platform API
 * AI-driven platform automation API for agent orchestration
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: api@fanno.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  PlatformStats,
} from '../models/index';
import {
    PlatformStatsFromJSON,
    PlatformStatsToJSON,
} from '../models/index';

/**
 * 
 */
export class PlatformApi extends runtime.BaseAPI {

    /**
     * Get platform statistics
     */
    async getStatsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlatformStats>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuth authentication
        }


        let urlPath = `/stats`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlatformStatsFromJSON(jsonValue));
    }

    /**
     * Get platform statistics
     */
    async getStats(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlatformStats> {
        const response = await this.getStatsRaw(initOverrides);
        return await response.value();
    }

}
