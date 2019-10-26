using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace KinectServerWPF
{
    class ServerCommunication
    {
        // URL of the OPC XML DA server that delivers the values
        string xmldaUrl = "http://141.30.154.211:8087/OPC/DA";

        private string getSoapWriteMessage(int from, int to)
        {
            string soapMessage = @"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/"" " +
            @"                   xmlns:SOAP-ENC=""http://schemas.xmlsoap.org/soap/encoding/"" " +
            @"                   xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" " +
            @"                   xmlns:xsd=""http://www.w3.org/2001/XMLSchema"">" +
            @"  <SOAP-ENV:Body>" +
            @"    <m:Write xmlns:m=""http://opcfoundation.org/webservices/XMLDA/1.0/"">" +
            @"      <m:Options ReturnErrorText=""true"" ReturnDiagnosticInfo=""true"" ReturnItemTime=""true"" ReturnItemPath=""true"" ReturnItemName=""true""/>" +
            @"      <m:ItemList>" +
            @"        <m:Items ItemName=""Schneider/Behaelter_A_FL"">" +
            @"		   <m:Value xsi:type=""xsd:int"">" + from + "</m:Value>" +
            @"		 </m:Items>" +
            @"        <m:Items ItemName=""Schneider/Behaelter_B_FL"">" +
            @"		   <m:Value xsi:type=""xsd:int"">" + to + "</m:Value>" +
            @"		 </m:Items>" +
            @"        <m:Items ItemName=""Schneider/Start_Umpumpen_FL"">" +
            @"		   <m:Value xsi:type=""xsd:boolean"">0</m:Value>" +
            @"		 </m:Items>" +
            @"      </m:ItemList>" +
            @"    </m:Write>" +
            @"  </SOAP-ENV:Body>" +
            @"</SOAP-ENV:Envelope>";

            return soapMessage;
        }

        public void sendSoapWriteMessage(string originTank, string targetTank)
        {
            string soapResult = "-";

            #region tank number
            int from = 1, to = 1;
            switch (originTank)
            {
                case "Tank 1":
                    from = 1;
                    break;
                case "Tank 2":
                    from = 2;
                    break;
                case "Tank 3":
                    from = 3;
                    break;
                default:
                    from = 0;
                    break;
            }

            switch (targetTank)
            {
                case "Tank 1":
                    to = 1;
                    break;
                case "Tank 2":
                    to = 2;
                    break;
                case "Tank 3":
                    to = 3;
                    break;
                default:
                    to = 0;
                    break;

            }
            #endregion

            HttpWebRequest request = CreaeWebRequest();
            XmlDocument soapEnvelopeXml = new XmlDocument();
            soapEnvelopeXml.LoadXml(getSoapWriteMessage(from, to));

            using (Stream stream = request.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }
            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                {
                    soapResult = rd.ReadToEnd();
                }
            }
            XmlDocument result = new XmlDocument();
            result.LoadXml(soapResult);
            result.Save("reult.xml");
        }

        private HttpWebRequest CreaeWebRequest()
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(xmldaUrl);
            webRequest.Headers.Add("SOAPAction", @"""http://opcfoundation.org/webservices/XMLDA/1.0/Write""");
            webRequest.Method = "POST";
            return webRequest;
        }
    }
}
