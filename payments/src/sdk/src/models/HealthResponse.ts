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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface HealthResponse
 */
export interface HealthResponse {
    /**
     * Health status of the service
     * @type {string}
     * @memberof HealthResponse
     */
    status: HealthResponseStatusEnum;
    /**
     * Current server timestamp
     * @type {Date}
     * @memberof HealthResponse
     */
    timestamp: Date;
    /**
     * Service identifier
     * @type {string}
     * @memberof HealthResponse
     */
    service: string;
}


/**
 * @export
 */
export const HealthResponseStatusEnum = {
    Healthy: 'healthy'
} as const;
export type HealthResponseStatusEnum = typeof HealthResponseStatusEnum[keyof typeof HealthResponseStatusEnum];


/**
 * Check if a given object implements the HealthResponse interface.
 */
export function instanceOfHealthResponse(value: object): value is HealthResponse {
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('timestamp' in value) || value['timestamp'] === undefined) return false;
    if (!('service' in value) || value['service'] === undefined) return false;
    return true;
}

export function HealthResponseFromJSON(json: any): HealthResponse {
    return HealthResponseFromJSONTyped(json, false);
}

export function HealthResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): HealthResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'status': json['status'],
        'timestamp': (new Date(json['timestamp'])),
        'service': json['service'],
    };
}

export function HealthResponseToJSON(json: any): HealthResponse {
    return HealthResponseToJSONTyped(json, false);
}

export function HealthResponseToJSONTyped(value?: HealthResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'status': value['status'],
        'timestamp': ((value['timestamp']).toISOString()),
        'service': value['service'],
    };
}

