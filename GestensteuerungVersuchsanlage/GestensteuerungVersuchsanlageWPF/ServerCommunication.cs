using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml;

namespace GestensteuerungVersuchsanlage
{
    class ServerCommunication
    {
        // URL of the OPC XML DA server that delivers the values
        string xmldaUrl = "http://141.30.154.211:8087/OPC/DA";

        private string getSoapWriteMessage(int from, int to, int start)
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
            @"		   <m:Value xsi:type=""xsd:boolean"">"+ start + "</m:Value>" +
            @"		 </m:Items>" +
            @"      </m:ItemList>" +
            @"    </m:Write>" +
            @"  </SOAP-ENV:Body>" +
            @"</SOAP-ENV:Envelope>";

            return soapMessage;
        }

        private string getSoapReadMessage()
        {
            string soapMessage = @"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/"" " +
            @"                   xmlns:SOAP-ENC=""http://schemas.xmlsoap.org/soap/encoding/"" " +
            @"                   xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" " +
            @"                   xmlns:xsd=""http://www.w3.org/2001/XMLSchema"">" +
            @"  <SOAP-ENV:Body>" +
            @"    <m:Read xmlns:m=""http://opcfoundation.org/webservices/XMLDA/1.0/"">" +
            @"      <m:Options ReturnErrorText=""false"" ReturnDiagnosticInfo=""false"" ReturnItemTime=""false"" ReturnItemPath=""false"" ReturnItemName=""true""/>" +
            @"      <m:ItemList>" +
            @"        <m:Items ItemName=""Schneider/Fuellstand1_Ist""/>" +
            @"        <m:Items ItemName=""Schneider/Fuellstand2_Ist""/>" +
            @"        <m:Items ItemName=""Schneider/Fuellstand3_Ist""/>" +
            @"        <m:Items ItemName=""Schneider/LH1""/>" +
            @"        <m:Items ItemName=""Schneider/LH2""/>" +
            @"        <m:Items ItemName=""Schneider/LH3""/>" +
            @"        <m:Items ItemName=""Schneider/LL1""/>" +
            @"        <m:Items ItemName=""Schneider/LL2""/>" +
            @"        <m:Items ItemName=""Schneider/LL3""/>" +
            @"      </m:ItemList>" +
            @"    </m:Read>" +
            @"  </SOAP-ENV:Body>" +
            @"</SOAP-ENV:Envelope>";
            return soapMessage;
        }

        public bool sendSoapWriteMessage(string originTank, string targetTank, int start)
        {
            string soapResult = "-";
            string action = @"""http://opcfoundation.org/webservices/XMLDA/1.0/Write""";

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

            HttpWebRequest request = CreaeWebRequest(action);
            XmlDocument soapEnvelopeXml = new XmlDocument();
            soapEnvelopeXml.LoadXml(getSoapWriteMessage(from, to, start));
            try { 
                using (Stream stream = request.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);
                }
                using (WebResponse response = request.GetResponse())
                {
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {
                        soapResult = rd.ReadToEnd();
                        return true;
                    }
                }
            }
            catch (System.Net.WebException)
            {
                return false;
            }
        }

        public List<string> sendSoapReadMessage()
        {
            string soapResult;
            string action = @"""http://opcfoundation.org/webservices/XMLDA/1.0/Read""";
            List<string> levels = new List<string>();

            HttpWebRequest request = CreaeWebRequest(action);
            XmlDocument soapEnvelopeXml = new XmlDocument();
            soapEnvelopeXml.LoadXml(getSoapReadMessage());
            try
            {
                using (Stream stream = request.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);
                }
                using (WebResponse response = request.GetResponse())
                {
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {
                        soapResult = rd.ReadToEnd();
                        XmlDocument answer = new XmlDocument();
                        answer.LoadXml(soapResult);

                        var items = answer.GetElementsByTagName("Items");
                        // Tank levels 1 -3
                        levels.Add(items[0].FirstChild.FirstChild.Value);
                        levels.Add(items[1].FirstChild.FirstChild.Value);
                        levels.Add(items[2].FirstChild.FirstChild.Value);

                        // High level 1-3
                        levels.Add(items[3].FirstChild.FirstChild.Value);
                        levels.Add(items[4].FirstChild.FirstChild.Value);
                        levels.Add(items[5].FirstChild.FirstChild.Value);

                        // Low level 1-3
                        levels.Add(items[6].FirstChild.FirstChild.Value);
                        levels.Add(items[7].FirstChild.FirstChild.Value);
                        levels.Add(items[8].FirstChild.FirstChild.Value);
                    }
                }
            }
            catch (System.Net.WebException){ }
            return levels;
        }

        private HttpWebRequest CreaeWebRequest(string action)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(xmldaUrl);
            webRequest.Headers.Add("SOAPAction", action);
            webRequest.Method = "POST";
            return webRequest;
        }
    }
}
