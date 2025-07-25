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
  Agent,
  AgentUpdateRequest,
} from '../models/index';
import {
    AgentFromJSON,
    AgentToJSON,
    AgentUpdateRequestFromJSON,
    AgentUpdateRequestToJSON,
} from '../models/index';

export interface GetAgentRequest {
    id: number;
}

export interface UpdateAgentRequest {
    id: number;
    agentUpdateRequest: AgentUpdateRequest;
}

/**
 * 
 */
export class AgentsApi extends runtime.BaseAPI {

    /**
     * Get specific agent
     */
    async getAgentRaw(requestParameters: GetAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Agent>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getAgent().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuth authentication
        }


        let urlPath = `/agents/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AgentFromJSON(jsonValue));
    }

    /**
     * Get specific agent
     */
    async getAgent(requestParameters: GetAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Agent> {
        const response = await this.getAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List all AI agents
     */
    async getAgentsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Agent>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuth authentication
        }


        let urlPath = `/agents`;

        const response = await this.request({
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(AgentFromJSON));
    }

    /**
     * List all AI agents
     */
    async getAgents(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Agent>> {
        const response = await this.getAgentsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Update agent configuration
     */
    async updateAgentRaw(requestParameters: UpdateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Agent>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updateAgent().'
            );
        }

        if (requestParameters['agentUpdateRequest'] == null) {
            throw new runtime.RequiredError(
                'agentUpdateRequest',
                'Required parameter "agentUpdateRequest" was null or undefined when calling updateAgent().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuth authentication
        }


        let urlPath = `/agents/{id}`;
        urlPath = urlPath.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id'])));

        const response = await this.request({
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: AgentUpdateRequestToJSON(requestParameters['agentUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AgentFromJSON(jsonValue));
    }

    /**
     * Update agent configuration
     */
    async updateAgent(requestParameters: UpdateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Agent> {
        const response = await this.updateAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
