import React from 'react';
import { FileText, BarChart3, ClipboardList, Search, MoreHorizontal } from 'lucide-react';

const Resources: React.FC = () => {
  const resourceTypes = [
    {
      icon: FileText,
      title: 'Manuals & Guides',
      description: 'Official DRRM procedures and best practices',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: BarChart3,
      title: 'Reports & Data',
      description: 'Incident reports and statistical analysis',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: ClipboardList,
      title: 'Forms & Templates',
      description: 'Ready-to-use templates for your needs',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const accessSteps = [
    'Click on any folder to view its contents',
    'Click the three-dot menu on a file to download',
    'Some files may require sign-in with your official email'
  ];

  return (
    <section id="resources" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4 relative inline-block">
            <span className="relative z-10 px-4">RESOURCES & DOWNLOADS</span>
            <span className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-400 z-0"></span>
          </h2>
          <p className="text-gray-700 mb-2">
            Essential disaster preparedness and response materials for the community
          </p>
          <p className="font-light italic max-w-2xl mx-auto text-sm">
            <strong>Note:</strong> All the information materials here are for public consumption. Request for high-resolution copies for printing and/or reproduction can be requested through the Public Information Unit
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Side - Description */}
            <div className="md:w-1/3">
              <div className="sticky top-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  Resources Available
                </h2>
                <div className="space-y-4">
                  {resourceTypes.map((resource, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`${resource.bgColor} p-2 rounded-lg`}>
                        <resource.icon className={`h-6 w-6 ${resource.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-medium mb-3">How to Access Files</h3>
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                    {accessSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Right Side - Google Drive Embed */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Public Resources</h3>
                      <p className="text-blue-100 text-sm">Download & View Only</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full hover:bg-blue-700 transition">
                        <Search className="h-5 w-5 text-white" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-blue-700 transition">
                        <MoreHorizontal className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Google Drive Folder Embed */}
                <div className="relative h-[500px]">
                  {/* Loading State */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mb-4"></div>
                      <p className="text-gray-500">Loading folder contents...</p>
                    </div>
                  </div>
                  
                  {/* Placeholder for Google Drive embed */}
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-600">Google Drive Integration</p>
                      <p className="text-sm text-gray-500">Resources folder would be embedded here</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <p className="text-xs text-gray-500">All resources are property of MDRRMO</p>
                  <div className="flex gap-2">
                    <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">
                      Request Access
                    </button>
                    <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Report Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;