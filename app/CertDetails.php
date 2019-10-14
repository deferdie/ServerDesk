<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Support\Arr;

class CertDetails
{
    /**
     * The domain to query
     *
     * @var array
     */
    protected $domain = null;

    /**
     * The cert information
     *
     * @var array
     */
    protected $certInfo = null;
    public function __construct(string $domain)
    {
        $this->domain = strtolower($domain);
        $this->ssl = $this->getCertInformation($this->domain);
        $this->certInfo = openssl_x509_parse($this->ssl);
    }
    /**
     * Returns the expiry date for the cert
     *
     * @return void
     */
    public function getExpiryDate()
    {
        return Arr::get($this->certInfo, 'validTo_time_t', null);
    }

    /**
     * Returns the valid from date
     *
     * @return void
     */
    public function getValidFromDate()
    {
        return Arr::get($this->certInfo, 'validFrom_time_t', null);
    }

    /**
     * Returns signature
     *
     * @return void
     */
    public function getSignature()
    {
        return Arr::get($this->certInfo, 'signatureTypeLN', null);
    }

    /**
     * Returns the issuer
     *
     * @return void
     */
    public function getIssuer()
    {
        return Arr::get($this->certInfo, 'issuer.CN', null);
    }

    /**
     * Returns the organisation
     *
     * @return void
     */
    public function getOrganisationName()
    {
        return Arr::get($this->certInfo, 'subject.O', null);
    }

    /**
     * Returns the organisation
     *
     * @return void
     */
    public function getAlternativeNames()
    {
        return Arr::get($this->certInfo, 'extensions.subjectAltName', null);
    }

    /**
     * Returns the server type
     *
     * @return void
     */
    public function getServerType()
    {
        try {
            $ch = curl_init();
            // Set url
            curl_setopt($ch, CURLOPT_URL, $this->domain);
            // Return the transfer as a string
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // Enable headers
            curl_setopt($ch, CURLOPT_HEADER, 1);
            // Get only headers
            curl_setopt($ch, CURLOPT_NOBODY, 1);
            $output = curl_exec($ch);
            curl_close($ch);
            $headers = explode("\r\n", rtrim($output));
            if (is_array($headers)) {
                foreach ($headers as $header) {
                    $header = explode(':', $header);
                    if ($header[0] === 'server') {
                        return $header[1];
                    }
                }
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Returns the domain ip address
     *
     * @return void
     */
    public function getServerIpAddress()
    {
        $ip = gethostbyname(parse_url($this->domain, PHP_URL_HOST));

        if ($ip) {
            return $ip;
        }
        return gethostbyname($this->domain);
    }

    /**
     * Returns the days left til expiry
     *
     * @return void
     */
    public function getDaysLeft()
    {
        return Carbon::parse($this->getExpiryDate())->diffInDays(Carbon::now(), true);
    }

    /**
     * Returns the common name
     *
     * @return void
     */
    public function getCommonName()
    {
        return Arr::get($this->certInfo, 'subject.CN', null);
    }

    /**
     * Returns the serial number
     *
     * @return void
     */
    public function getSerialNumber()
    {
        return Arr::get($this->certInfo, 'serialNumber', null);
    }

    /**
     * Returns the location
     *
     * @return void
     */
    public function getLocation()
    {
        return Arr::get($this->certInfo, 'subject.L', null) . ' ' .
            Arr::get($this->certInfo, 'subject.ST', null) . ' ' .
            Arr::get($this->certInfo, 'subject.C', null);
    }

    /**
     * Get the certificate informaion for a given domain
     *
     * @param string $domain
     * @return void
     */
    public function getCertInformation(string $domainToCheck)
    {
        try {
            $domain = parse_url($domainToCheck, PHP_URL_HOST);
            if (!$domain) {
                $domain = $domainToCheck;
            }
            $get = stream_context_create(array("ssl" => array("capture_peer_cert" => TRUE)));
            $read = stream_socket_client("ssl://" . $domain . ":443", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $get);
            $cert = stream_context_get_params($read);
            // Add this domain to the domain checked list
            return $cert['options']['ssl']['peer_certificate'];
        } catch (\Exception $e) {
            // Log error for this domain
        }
    }
}
