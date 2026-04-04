<?php

namespace App\Services;

use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;

class XenditService
{
    protected InvoiceApi $invoiceApi;

    public function __construct()
    {
        Configuration::setXenditKey(config('services.xendit.secret_key'));
        $this->invoiceApi = new InvoiceApi;
    }

    public function createInvoice(array $params): array
    {
        $request = new CreateInvoiceRequest([
            'external_id' => $params['external_id'],
            'amount' => $params['amount'],
            'payer_email' => $params['payer_email'],
            'description' => $params['description'],
            'success_redirect_url' => $params['success_url'] ?? config('app.url'),
            'failure_redirect_url' => $params['failure_url'] ?? config('app.url'),
            'currency' => 'IDR',
            'invoice_duration' => 86400,
        ]);

        $response = $this->invoiceApi->createInvoice($request);

        return json_decode(json_encode($response), true);
    }

    public function getInvoice(string $invoiceId): array
    {
        $response = $this->invoiceApi->getInvoiceById($invoiceId);

        return json_decode(json_encode($response), true);
    }
}
